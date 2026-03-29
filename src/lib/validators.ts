/**
 * 验证手机号格式
 * 规则：1开头，11位数字
 */
export function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone.trim());
}

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * 验证咨询表单数据
 */
export interface ConsultationFormData {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  needType: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateConsultationForm(data: ConsultationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // 姓名必填
  if (!data.name || !data.name.trim()) {
    errors.name = "请输入姓名";
  }

  // 电话必填且格式正确
  if (!data.phone || !data.phone.trim()) {
    errors.phone = "请输入联系电话";
  } else if (!validatePhone(data.phone)) {
    errors.phone = "请输入正确的手机号码";
  }

  // 邮箱格式验证（如果填写）
  if (data.email && data.email.trim() && !validateEmail(data.email)) {
    errors.email = "请输入正确的邮箱格式";
  }

  // 需求类型必填
  if (!data.needType || !data.needType.trim()) {
    errors.needType = "请选择需求类型";
  }

  // 留言必填
  if (!data.message || !data.message.trim()) {
    errors.message = "请输入留言内容";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
