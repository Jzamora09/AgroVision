export interface ValidationResult {
  valid: boolean;
  message: string;
}

export function validateName(name: string): ValidationResult {
  const value = name.trim();

  if (!value) {
    return {
      valid: false,
      message: "El nombre es obligatorio.",
    };
  }

  if (value.length < 3) {
    return {
      valid: false,
      message: "El nombre debe tener al menos 3 caracteres.",
    };
  }

  if (value.length > 80) {
    return {
      valid: false,
      message: "El nombre no puede superar los 80 caracteres.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}

export function validateEmail(email: string): ValidationResult {
  const value = email.trim().toLowerCase();

  if (!value) {
    return {
      valid: false,
      message: "El correo es obligatorio.",
    };
  }

  const regex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!regex.test(value)) {
    return {
      valid: false,
      message: "Ingresa un correo válido.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      valid: false,
      message: "La contraseña es obligatoria.",
    };
  }

  if (password.length < 8) {
    return {
      valid: false,
      message: "Debe tener al menos 8 caracteres.",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Debe contener una letra mayúscula.",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Debe contener una letra minúscula.",
    };
  }

  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: "Debe contener un número.",
    };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      message: "Debe contener un carácter especial.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}