import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@kobonz.com"
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"

/**
 * Phase 6: Email Templates with RTL Support
 * React Email templates for notifications
 */

// ============================================
// EMAIL TEMPLATE GENERATOR
// ============================================

interface EmailTemplateOptions {
  to: string
  subject: string
  template: string
  variables: Record<string, any>
  isRTL?: boolean
}

export async function sendTemplateEmail(options: EmailTemplateOptions) {
  const { to, subject, template, variables, isRTL = false } = options

  const html = generateEmailHTML(template, variables, isRTL)

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to send template email:", error)
    return { success: false, error }
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

function generateEmailHTML(
  template: string,
  variables: Record<string, any>,
  isRTL: boolean
): string {
  const direction = isRTL ? "rtl" : "ltr"
  const textAlign = isRTL ? "right" : "left"
  const fontFamily = isRTL
    ? "'Tajawal', 'Arial', sans-serif"
    : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

  const baseStyle = `
    font-family: ${fontFamily};
    line-height: 1.6;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    direction: ${direction};
  `

  const headerStyle = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  `

  const contentStyle = `
    background: #fff;
    padding: 40px;
    border: 1px solid #e0e0e0;
    border-top: none;
    border-radius: 0 0 10px 10px;
    text-align: ${textAlign};
  `

  const buttonStyle = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 14px 30px;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    display: inline-block;
    margin: 20px 0;
  `

  switch (template) {
    case "coupon-approved":
      return generateCouponApprovedEmail(variables, baseStyle, headerStyle, contentStyle, buttonStyle, isRTL)
    
    case "coupon-rejected":
      return generateCouponRejectedEmail(variables, baseStyle, headerStyle, contentStyle, buttonStyle, isRTL)
    
    case "new-commission":
      return generateNewCommissionEmail(variables, baseStyle, headerStyle, contentStyle, buttonStyle, isRTL)
    
    case "commission-ready":
      return generateCommissionReadyEmail(variables, baseStyle, headerStyle, contentStyle, buttonStyle, isRTL)
    
    case "payout-approved":
      return generatePayoutApprovedEmail(variables, baseStyle, headerStyle, contentStyle, buttonStyle, isRTL)
    
    case "payout-completed":
      return generatePayoutCompletedEmail(variables, baseStyle, headerStyle, contentStyle, buttonStyle, isRTL)
    
    case "coupon-expiring":
      return generateCouponExpiringEmail(variables, baseStyle, headerStyle, contentStyle, buttonStyle, isRTL)
    
    case "low-stock":
      return generateLowStockEmail(variables, baseStyle, headerStyle, contentStyle, buttonStyle, isRTL)
    
    case "system-announcement":
      return generateSystemAnnouncementEmail(variables, baseStyle, headerStyle, contentStyle, buttonStyle, isRTL)
    
    default:
      return generateGenericEmail(variables, baseStyle, headerStyle, contentStyle, buttonStyle, isRTL)
  }
}

// ============================================
// INDIVIDUAL EMAIL TEMPLATES
// ============================================

function generateCouponApprovedEmail(
  vars: Record<string, any>,
  baseStyle: string,
  headerStyle: string,
  contentStyle: string,
  buttonStyle: string,
  isRTL: boolean
): string {
  const { couponTitle, couponId, userName } = vars
  const dashboardUrl = `${appUrl}/store/coupons`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isRTL ? 'تمت الموافقة على القسيمة' : 'Coupon Approved'}</title>
        ${isRTL ? '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">' : ''}
      </head>
      <body style="${baseStyle}">
        <div style="${headerStyle}">
          <h1 style="color: white; margin: 0; font-size: 28px;">
            ${isRTL ? '🎉 تمت الموافقة على قسيمتك!' : '🎉 Coupon Approved!'}
          </h1>
        </div>
        <div style="${contentStyle}">
          <h2 style="color: #333; margin-top: 0;">
            ${isRTL ? `مرحباً ${userName}!` : `Hi ${userName}!`}
          </h2>
          <p style="color: #666; font-size: 16px;">
            ${isRTL 
              ? `لقد تمت الموافقة على قسيمتك "<strong>${couponTitle}</strong>" وهي الآن متاحة في السوق!`
              : `Your coupon "<strong>${couponTitle}</strong>" has been approved and is now live on the marketplace!`
            }
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="${buttonStyle}">
              ${isRTL ? 'عرض لوحة التحكم' : 'View Dashboard'}
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            ${isRTL 
              ? 'هل تحتاج إلى مساعدة؟ اتصل بنا على support@kobonz.com'
              : 'Need help? Contact us at support@kobonz.com'
            }
          </p>
        </div>
      </body>
    </html>
  `
}

function generateCouponRejectedEmail(
  vars: Record<string, any>,
  baseStyle: string,
  headerStyle: string,
  contentStyle: string,
  buttonStyle: string,
  isRTL: boolean
): string {
  const { couponTitle, reason, userName } = vars
  const supportUrl = `${appUrl}/store/coupons`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isRTL ? 'تم رفض القسيمة' : 'Coupon Rejected'}</title>
        ${isRTL ? '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">' : ''}
      </head>
      <body style="${baseStyle}">
        <div style="${headerStyle}">
          <h1 style="color: white; margin: 0; font-size: 28px;">Kobonz</h1>
        </div>
        <div style="${contentStyle}">
          <h2 style="color: #333; margin-top: 0;">
            ${isRTL ? `مرحباً ${userName}` : `Hi ${userName}`}
          </h2>
          <p style="color: #666; font-size: 16px;">
            ${isRTL 
              ? `للأسف، تم رفض قسيمتك "<strong>${couponTitle}</strong>".`
              : `Unfortunately, your coupon "<strong>${couponTitle}</strong>" was rejected.`
            }
          </p>
          ${reason ? `
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <strong>${isRTL ? 'السبب:' : 'Reason:'}</strong>
              <p style="margin: 5px 0 0 0;">${reason}</p>
            </div>
          ` : ''}
          <p style="color: #666; font-size: 16px;">
            ${isRTL 
              ? 'يمكنك تعديل القسيمة وإعادة تقديمها، أو الاتصال بالدعم للحصول على مزيد من المعلومات.'
              : 'You can edit your coupon and resubmit it, or contact support for more information.'
            }
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${supportUrl}" style="${buttonStyle}">
              ${isRTL ? 'عرض القسائم' : 'View My Coupons'}
            </a>
          </div>
        </div>
      </body>
    </html>
  `
}

function generateNewCommissionEmail(
  vars: Record<string, any>,
  baseStyle: string,
  headerStyle: string,
  contentStyle: string,
  buttonStyle: string,
  isRTL: boolean
): string {
  const { amount, couponTitle, userName } = vars
  const dashboardUrl = `${appUrl}/affiliate/dashboard`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isRTL ? 'عمولة جديدة!' : 'New Commission!'}</title>
        ${isRTL ? '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">' : ''}
      </head>
      <body style="${baseStyle}">
        <div style="${headerStyle}">
          <h1 style="color: white; margin: 0; font-size: 28px;">
            ${isRTL ? '💰 عمولة جديدة!' : '💰 New Commission Earned!'}
          </h1>
        </div>
        <div style="${contentStyle}">
          <h2 style="color: #333; margin-top: 0;">
            ${isRTL ? `تهانينا ${userName}!` : `Congratulations ${userName}!`}
          </h2>
          <p style="color: #666; font-size: 16px;">
            ${isRTL 
              ? `لقد ربحت <strong style="color: #667eea; font-size: 24px;">$${amount}</strong> من القسيمة "${couponTitle}".`
              : `You've earned <strong style="color: #667eea; font-size: 24px;">$${amount}</strong> commission from "${couponTitle}".`
            }
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="${buttonStyle}">
              ${isRTL ? 'عرض أرباحي' : 'View My Earnings'}
            </a>
          </div>
        </div>
      </body>
    </html>
  `
}

function generateCommissionReadyEmail(
  vars: Record<string, any>,
  baseStyle: string,
  headerStyle: string,
  contentStyle: string,
  buttonStyle: string,
  isRTL: boolean
): string {
  const { amount, userName } = vars
  const payoutUrl = `${appUrl}/affiliate/dashboard`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isRTL ? 'العمولة جاهزة للسحب' : 'Commission Ready'}</title>
        ${isRTL ? '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">' : ''}
      </head>
      <body style="${baseStyle}">
        <div style="${headerStyle}">
          <h1 style="color: white; margin: 0; font-size: 28px;">
            ${isRTL ? '✅ جاهز للسحب!' : '✅ Ready for Payout!'}
          </h1>
        </div>
        <div style="${contentStyle}">
          <h2 style="color: #333; margin-top: 0;">
            ${isRTL ? `مرحباً ${userName}!` : `Hi ${userName}!`}
          </h2>
          <p style="color: #666; font-size: 16px;">
            ${isRTL 
              ? `لديك <strong style="color: #667eea;">$${amount}</strong> متاحة للسحب الآن!`
              : `You have <strong style="color: #667eea;">$${amount}</strong> available for payout!`
            }
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${payoutUrl}" style="${buttonStyle}">
              ${isRTL ? 'طلب السحب' : 'Request Payout'}
            </a>
          </div>
        </div>
      </body>
    </html>
  `
}

function generatePayoutApprovedEmail(
  vars: Record<string, any>,
  baseStyle: string,
  headerStyle: string,
  contentStyle: string,
  buttonStyle: string,
  isRTL: boolean
): string {
  const { amount, userName } = vars

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isRTL ? 'تمت الموافقة على السحب' : 'Payout Approved'}</title>
        ${isRTL ? '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">' : ''}
      </head>
      <body style="${baseStyle}">
        <div style="${headerStyle}">
          <h1 style="color: white; margin: 0; font-size: 28px;">
            ${isRTL ? '🎉 تمت الموافقة على طلب السحب!' : '🎉 Payout Approved!'}
          </h1>
        </div>
        <div style="${contentStyle}">
          <h2 style="color: #333; margin-top: 0;">
            ${isRTL ? `أخبار رائعة، ${userName}!` : `Great news, ${userName}!`}
          </h2>
          <p style="color: #666; font-size: 16px;">
            ${isRTL 
              ? `تمت الموافقة على طلب السحب الخاص بك بمبلغ <strong>$${amount}</strong> ويتم معالجته الآن.`
              : `Your payout request of <strong>$${amount}</strong> has been approved and is being processed.`
            }
          </p>
          <p style="color: #666; font-size: 14px;">
            ${isRTL 
              ? 'سيتم إرسال الدفعة خلال 3-5 أيام عمل.'
              : 'The payment will be sent within 3-5 business days.'
            }
          </p>
        </div>
      </body>
    </html>
  `
}

function generatePayoutCompletedEmail(
  vars: Record<string, any>,
  baseStyle: string,
  headerStyle: string,
  contentStyle: string,
  buttonStyle: string,
  isRTL: boolean
): string {
  const { amount, userName } = vars

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isRTL ? 'تم إكمال السحب' : 'Payout Completed'}</title>
        ${isRTL ? '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">' : ''}
      </head>
      <body style="${baseStyle}">
        <div style="${headerStyle}">
          <h1 style="color: white; margin: 0; font-size: 28px;">
            ${isRTL ? '💸 تم إرسال الدفعة!' : '💸 Payout Completed!'}
          </h1>
        </div>
        <div style="${contentStyle}">
          <h2 style="color: #333; margin-top: 0;">
            ${isRTL ? `تهانينا ${userName}!` : `Congratulations ${userName}!`}
          </h2>
          <p style="color: #666; font-size: 16px;">
            ${isRTL 
              ? `تم إرسال دفعتك بمبلغ <strong>$${amount}</strong> بنجاح. يرجى التحقق من طريقة الدفع الخاصة بك.`
              : `Your payout of <strong>$${amount}</strong> has been completed successfully. Please check your payment method.`
            }
          </p>
        </div>
      </body>
    </html>
  `
}

function generateCouponExpiringEmail(
  vars: Record<string, any>,
  baseStyle: string,
  headerStyle: string,
  contentStyle: string,
  buttonStyle: string,
  isRTL: boolean
): string {
  const { couponTitle, daysLeft, couponId, userName } = vars
  const editUrl = `${appUrl}/store/coupons`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isRTL ? 'القسيمة تنتهي قريباً' : 'Coupon Expiring Soon'}</title>
        ${isRTL ? '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">' : ''}
      </head>
      <body style="${baseStyle}">
        <div style="${headerStyle}">
          <h1 style="color: white; margin: 0; font-size: 28px;">⏰ ${isRTL ? 'تذكير' : 'Reminder'}</h1>
        </div>
        <div style="${contentStyle}">
          <h2 style="color: #333; margin-top: 0;">
            ${isRTL ? `مرحباً ${userName}` : `Hi ${userName}`}
          </h2>
          <p style="color: #666; font-size: 16px;">
            ${isRTL 
              ? `قسيمتك "<strong>${couponTitle}</strong>" ستنتهي خلال <strong>${daysLeft}</strong> أيام.`
              : `Your coupon "<strong>${couponTitle}</strong>" will expire in <strong>${daysLeft}</strong> days.`
            }
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${editUrl}" style="${buttonStyle}">
              ${isRTL ? 'إدارة القسيمة' : 'Manage Coupon'}
            </a>
          </div>
        </div>
      </body>
    </html>
  `
}

function generateLowStockEmail(
  vars: Record<string, any>,
  baseStyle: string,
  headerStyle: string,
  contentStyle: string,
  buttonStyle: string,
  isRTL: boolean
): string {
  const { couponTitle, usesLeft, userName } = vars
  const editUrl = `${appUrl}/store/coupons`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isRTL ? 'مخزون منخفض' : 'Low Stock Alert'}</title>
        ${isRTL ? '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">' : ''}
      </head>
      <body style="${baseStyle}">
        <div style="${headerStyle}">
          <h1 style="color: white; margin: 0; font-size: 28px;">📊 ${isRTL ? 'تنبيه' : 'Alert'}</h1>
        </div>
        <div style="${contentStyle}">
          <h2 style="color: #333; margin-top: 0;">
            ${isRTL ? `مرحباً ${userName}` : `Hi ${userName}`}
          </h2>
          <p style="color: #666; font-size: 16px;">
            ${isRTL 
              ? `قسيمتك "<strong>${couponTitle}</strong>" لم يتبق منها سوى <strong>${usesLeft}</strong> استخدام.`
              : `Your coupon "<strong>${couponTitle}</strong>" has only <strong>${usesLeft}</strong> uses remaining.`
            }
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${editUrl}" style="${buttonStyle}">
              ${isRTL ? 'تحديث القسيمة' : 'Update Coupon'}
            </a>
          </div>
        </div>
      </body>
    </html>
  `
}

function generateSystemAnnouncementEmail(
  vars: Record<string, any>,
  baseStyle: string,
  headerStyle: string,
  contentStyle: string,
  buttonStyle: string,
  isRTL: boolean
): string {
  const { title, message, actionUrl, actionText } = vars

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${isRTL ? '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">' : ''}
      </head>
      <body style="${baseStyle}">
        <div style="${headerStyle}">
          <h1 style="color: white; margin: 0; font-size: 28px;">📢 ${title}</h1>
        </div>
        <div style="${contentStyle}">
          <div style="color: #666; font-size: 16px;">
            ${message}
          </div>
          ${actionUrl && actionText ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionUrl}" style="${buttonStyle}">
                ${actionText}
              </a>
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `
}

function generateGenericEmail(
  vars: Record<string, any>,
  baseStyle: string,
  headerStyle: string,
  contentStyle: string,
  buttonStyle: string,
  isRTL: boolean
): string {
  const { title, message, actionUrl, actionText } = vars

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || 'Kobonz Notification'}</title>
        ${isRTL ? '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">' : ''}
      </head>
      <body style="${baseStyle}">
        <div style="${headerStyle}">
          <h1 style="color: white; margin: 0; font-size: 28px;">${title || 'Kobonz'}</h1>
        </div>
        <div style="${contentStyle}">
          <div style="color: #666; font-size: 16px;">
            ${message}
          </div>
          ${actionUrl && actionText ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionUrl}" style="${buttonStyle}">
                ${actionText}
              </a>
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `
}
