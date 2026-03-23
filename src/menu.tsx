import { createRoot } from 'react-dom/client';
import { useSearchEngine } from './hooks/useSearchEngine';
import { SearchEngineType } from './types/search-engine-type';

function App() {
    const searchEngine = useSearchEngine();

    return (
        <main>
            <h1>Jobler</h1>
            {searchEngine !== SearchEngineType.none && <p>{searchEngine}</p>}
        </main>
    );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);
