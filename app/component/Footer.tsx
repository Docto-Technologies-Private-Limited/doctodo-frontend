export default function Footer() {
  return (
    <footer
      className="w-full py-4 px-4 text-center bg-secondary">
      <p
        className="text-sm font-semibold tracking-wide"
        style={{ color: 'rgba(255,255,255,0.85)' }}
      >
        © {new Date().getFullYear()}{' '}
        <span className="font-black text-white tracking-wider">VIDOCTO</span>
        <span className="font-normal">. All rights reserved.</span>
      </p>
    </footer>
  )
}
