import './Footer.css';
const Footer = () => {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="ftr-container">
        <div>
          <p>© {currentYear} - Created with ♟️ by Avudaiappan</p>
          <p>
            Enjoy chess, share knowledge, and play fair!
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;