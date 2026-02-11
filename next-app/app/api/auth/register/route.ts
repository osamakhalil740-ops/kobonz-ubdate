import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { generateReferralCode, generateToken } from "@/lib/utils"
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/email"
import { redisHelpers } from "@/lib/redis"

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  referralCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    // Hash password (bcrypt with 12 salt rounds)
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Generate unique referral code
    let referralCode = generateReferralCode()
    let isUnique = false
    
    while (!isUnique) {
      const existing = await prisma.user.findUnique({
        where: { referralCode },
      })
      if (!existing) {
        isUnique = true
      } else {
        referralCode = generateReferralCode()
      }
    }

    // Check if referred by someone
    let referrer = null
    let credits = 100 // Default signup bonus

    if (validatedData.referralCode) {
      referrer = await prisma.user.findUnique({
        where: { referralCode: validatedData.referralCode },
      })

      if (referrer) {
        credits = 150 // Bonus for referred signup
      }
    }

    // Generate email verification token
    const verificationToken = generateToken(32)
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
        referralCode,
        referredBy: referrer?.id,
        credits,
        provider: "credentials",
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    })

    // Create credit log for signup bonus
    await prisma.creditLog.create({
      data: {
        userId: user.id,
        type: referrer ? "SIGNUP_BONUS" : "SIGNUP_BONUS",
        amount: credits,
        balance: credits,
        description: referrer 
          ? `Signup bonus (referred by ${referrer.name})`
          : "Signup bonus",
      },
    })

    // If referred, give bonus to referrer
    if (referrer) {
      const referrerBonus = 100
      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          credits: {
            increment: referrerBonus,
          },
        },
      })

      await prisma.creditLog.create({
        data: {
          userId: referrer.id,
          type: "REFERRAL_BONUS",
          amount: referrerBonus,
          balance: referrer.credits + referrerBonus,
          description: `Referral bonus for ${user.name}`,
        },
      })
    }

    // Store verification token in Redis (24 hours)
    await redisHelpers.setVerificationToken(user.email, verificationToken)

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken)

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name)

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please check your email to verify your account.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}
