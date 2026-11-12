import React, { useContext, useState } from 'react';
import ClassExpenseApp from '../part-a-class/ClassExpenseApp.jsx';
import FunctionExpenseApp from '../part-b-hooks/FunctionExpenseApp.jsx';
import ThemeContext from './shared/ThemeContext.js';

function Workspace({ version, onVersionChange }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <main className="app-shell" data-theme={theme}>
      <div className="app-frame">
        <nav className="top-nav" aria-label="Chọn phiên bản">
          <div className="brand"><span className="brand-icon">S.</span><span>Sổ chi tiêu<span className="brand-period">.</span></span></div>
          <div className="version-control" role="group" aria-label="Phiên bản ứng dụng">
            <button type="button" className={version === 'class' ? 'selected' : ''} onClick={() => onVersionChange('class')} aria-pressed={version === 'class'}>A <span>Class</span></button>
            <button type="button" className={version === 'hooks' ? 'selected' : ''} onClick={() => onVersionChange('hooks')} aria-pressed={version === 'hooks'}>B <span>Hooks</span></button>
          </div>
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={`Chuyển sang giao diện ${theme === 'light' ? 'tối' : 'sáng'}`} title={`Giao diện ${theme === 'light' ? 'tối' : 'sáng'}`}><span aria-hidden="true">{theme === 'light' ? '◐' : '☼'}</span></button>
        </nav>
        {version === 'class' ? <ClassExpenseApp key="class" /> : <FunctionExpenseApp key="hooks" />}
      </div>
    </main>
  );
}

export default function App() {
  const [version, setVersion] = useState('class');
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light');
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Workspace version={version} onVersionChange={setVersion} />
    </ThemeContext.Provider>
  );
}
