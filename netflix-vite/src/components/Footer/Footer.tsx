

const Footer = () => (
  <footer className="bg-[#090612] text-white/50 text-sm mt-12 border-t border-white/10">
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
      <div>
        <p className="mb-2">
          Questions? Call{" "}
          <span className="text-purple-400 font-semibold">000-000-007</span>
        </p>
        <ul className="space-y-1">
          <li className="hover:text-white transition cursor-pointer">FAQ</li>
          <li className="hover:text-white transition cursor-pointer">Investor Relations</li>
          <li className="hover:text-white transition cursor-pointer">Privacy</li>
          <li className="hover:text-white transition cursor-pointer">Speed Test</li>
        </ul>
      </div>
      <div>
        <ul className="space-y-1">
          <li className="hover:text-white transition cursor-pointer">Help Centre</li>
          <li className="hover:text-white transition cursor-pointer">Jobs</li>
          <li className="hover:text-white transition cursor-pointer">Cookie Preferences</li>
          <li className="hover:text-white transition cursor-pointer">Legal Notices</li>
        </ul>
      </div>
      <div>
        <ul className="space-y-1">
          <li className="hover:text-white transition cursor-pointer">Account</li>
          <li className="hover:text-white transition cursor-pointer">Ways to Watch</li>
          <li className="hover:text-white transition cursor-pointer">Corporate Information</li>
          <li className="hover:text-white transition cursor-pointer">Only on Bingatch</li>
        </ul>
      </div>
      <div>
        <ul className="space-y-1">
          <li className="hover:text-white transition cursor-pointer">Media Centre</li>
          <li className="hover:text-white transition cursor-pointer">Terms of Use</li>
          <li className="hover:text-white transition cursor-pointer">Contact Us</li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;