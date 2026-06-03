export default function Button({ children, ...props }) {
  return (
    <button className="button button-primary" type="button" {...props}>
      {children}
    </button>
  )
}
