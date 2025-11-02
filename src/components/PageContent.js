import './PageContent.css';

const PageContent = ({ page, isAnimating }) => {
  const getPageContent = (pageName) => {
    const contents = {
      Home: { title: "Welcome Home" },
      About: { title: "About This Project" },
      Products: { title: "Our Products" },
      Contact: { title: "Get In Touch" },
      Settings: { title: "Settings & Preferences" },
      Help: { title: "Help & Support" },
    };

    return contents[pageName] || { title: pageName };
  };

  const content = getPageContent(page);

  return (
    <div className={`page-content ${isAnimating ? 'page-transition' : ''}`}>
      <div className="page-header">
        <h2 className="page-title">
          <span className="page-emoji">
            {page === 'Home' ? '🏠' : '📄'}
          </span>
          {content.title}
        </h2>
      </div>

      <div className="page-body">
        <div className="page-meta">
          <div className="meta-item">
            <span className="meta-label">Current URL:</span>
            <code className="meta-value">https://{page.toLowerCase()}</code>
          </div>
          <div className="meta-item">
            <span className="meta-label">Page Load:</span>
            <span className="meta-value">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageContent;
