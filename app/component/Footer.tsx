export default function Footer() {
  return (
    <footer className="w-full bg-secondary py-3 px-4">
      <p className="text-textWhite text-sm font-semibold tracking-wide text-center">
        © {new Date().getFullYear()}{' '}
        <span className="font-bold tracking-wider">VIDOCTO</span>
        <span className="font-normal">. All rights reserved.</span>
      </p>
    </footer>
  )
}