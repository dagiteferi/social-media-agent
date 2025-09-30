export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validatePostGeneration(data: {
  productContext: string
  targetAudience: string
  platform: string
  tone: string
}): ValidationResult {
  const errors: string[] = []

  if (!data.productContext?.trim()) {
    errors.push("Product context is required")
  } else if (data.productContext.length < 10) {
    errors.push("Product context must be at least 10 characters")
  }

  if (!data.targetAudience?.trim()) {
    errors.push("Target audience is required")
  } else if (data.targetAudience.length < 10) {
    errors.push("Target audience must be at least 10 characters")
  }

  if (!data.platform) {
    errors.push("Platform is required")
  }

  if (!data.tone) {
    errors.push("Tone is required")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
