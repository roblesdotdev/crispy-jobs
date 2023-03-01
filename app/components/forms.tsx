export function InputLabel({
  htmlFor,
  text,
}: {
  htmlFor: string
  text: string
}) {
  return <label htmlFor={htmlFor}>{text}</label>
}

export function ErrorLabel({ id, error }: { id: string; error?: string }) {
  return error ? (
    <span className="text-sm text-red-600" id={id}>
      {error}
    </span>
  ) : null
}

export function Input({
  name,
  errorId,
  placeholder,
  invalid = false,
  type = 'text',
}: {
  type?: string
  invalid?: boolean
  name: string
  errorId: string
  placeholder?: string
}) {
  return (
    <input
      type={type}
      name={name}
      id={name}
      placeholder={placeholder}
      aria-errormessage={errorId}
      aria-invalid={invalid}
    />
  )
}
