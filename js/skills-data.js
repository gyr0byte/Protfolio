// Single Source of Truth for Portfolio Skills Section (7 Categories, 76 Skills)
// Shared by Directory Tree View (js/skills.js) and Neural Network Graph View (js/skills-graph.js)
(function(global) {
    'use strict';

    const categories = [
        {
            id: 'ml',
            name: 'Machine Learning & Data Science',
            dirName: '01_Machine_Learning_&_Data_Science/',
            hubLabel: 'ML & Data Science',
            color: '#3fb950',
            lightColor: '#1a7f37',
            skills: [
                { id: 'numpy', label: 'NumPy', tooltip: 'N-dimensional arrays & vectorized numerical computing' },
                { id: 'pandas', label: 'Pandas', tooltip: 'Tabular data manipulation, cleaning & feature frames' },
                { id: 'matplotlib', label: 'Matplotlib', tooltip: '2D plotting, diagnostics & evaluation charts' },
                { id: 'seaborn', label: 'Seaborn', tooltip: 'Statistical visualizations & correlation heatmaps' },
                { id: 'scikit-learn', label: 'Scikit-learn', tooltip: 'Classical ML estimators, pipelines & preprocessing' },
                { id: 'xgboost', label: 'XGBoost', tooltip: 'Gradient boosted decision trees for tabular ML' },
                { id: 'random-forest', label: 'Random Forest', tooltip: 'Bagged decision tree ensembles for tabular tasks' },
                { id: 'svm', label: 'SVM', tooltip: 'Support Vector Machines & kernel margin classifiers' },
                { id: 'linear-regression', label: 'Linear Regression', tooltip: 'Ordinary least squares & regularized linear models' },
                { id: 'logistic-regression', label: 'Logistic Regression', tooltip: 'Probabilistic linear classification & log-odds' },
                { id: 'stacking-ensembles', label: 'Stacking Ensembles', tooltip: 'Meta-learning combining diverse base estimators' },
                { id: 'voting-ensembles', label: 'Voting Ensembles', tooltip: 'Hard & soft prediction aggregation across models' },
                { id: 'k-means', label: 'K-Means', tooltip: 'Centroid-based unsupervised partitioning & clustering' },
                { id: 'dbscan', label: 'DBSCAN', tooltip: 'Density-based clustering with outlier detection' },
                { id: 'pca', label: 'PCA', tooltip: 'Principal Component Analysis & dimensionality reduction' },
                { id: 'feature-engineering', label: 'Feature Engineering', tooltip: 'Domain transforms, encodings & signal extraction' },
                { id: 'cross-validation', label: 'Cross Validation', tooltip: 'K-fold & stratified evaluation for generalization' },
                { id: 'gridsearchcv', label: 'GridSearchCV', tooltip: 'Systematic hyperparameter search with cross-validation' }
            ]
        },
        {
            id: 'dl_nlp',
            name: 'Deep Learning & NLP',
            dirName: '02_Deep_Learning_&_NLP/',
            hubLabel: 'Deep Learning & NLP',
            color: '#d29922',
            lightColor: '#9a6700',
            skills: [
                { id: 'pytorch', label: 'PyTorch', tooltip: 'Dynamic autograd, neural architectures & training loops' },
                { id: 'tensorflow', label: 'TensorFlow', tooltip: 'Deep learning computation graphs & model deployment' },
                { id: 'keras', label: 'Keras', tooltip: 'High-level neural network modeling & layer APIs' },
                { id: 'ann', label: 'ANN', tooltip: 'Multi-layer perceptrons & feedforward neural networks' },
                { id: 'cnn', label: 'CNN', tooltip: 'Convolutional architectures for spatial feature learning' },
                { id: 'rnn', label: 'RNN', tooltip: 'Recurrent sequence modeling with temporal hidden state' },
                { id: 'lstm', label: 'LSTM', tooltip: 'Gated recurrent networks for long-range sequences' },
                { id: 'transformers', label: 'Transformers', tooltip: 'Self-attention architectures & sequence modeling' },
                { id: 'hugging-face', label: 'Hugging Face', tooltip: 'Pretrained model hub, tokenizers & NLP pipelines' },
                { id: 'codebert', label: 'CodeBERT', tooltip: 'Bimodal pretrained transformer for source code & text' },
                { id: 'tf-idf', label: 'TF-IDF', tooltip: 'Sparse lexical weighting for text feature extraction' },
                { id: 'text-classification', label: 'Text Classification', tooltip: 'Multi-class NLP categorization & sentiment tagging' },
                { id: 'ast-analysis', label: 'AST Analysis', tooltip: 'Static Abstract Syntax Tree traversal & code metrics' }
            ]
        },
        {
            id: 'genai',
            name: 'Generative AI & Retrieval',
            dirName: '03_Generative_AI_&_Retrieval/',
            hubLabel: 'GenAI & Retrieval',
            color: '#f78166',
            lightColor: '#cf222e',
            skills: [
                { id: 'langchain', label: 'LangChain', tooltip: 'Composable LLM chains, prompts & retrieval workflows' },
                { id: 'langgraph', label: 'LangGraph', tooltip: 'Stateful cyclic graphs for multi-step agent control' },
                { id: 'rag', label: 'RAG', tooltip: 'Retrieval-Augmented Generation grounding LLM responses' },
                { id: 'embeddings', label: 'Embeddings', tooltip: 'Dense semantic vector representations for retrieval' },
                { id: 'chromadb', label: 'ChromaDB', tooltip: 'Open-source vector database for semantic storage' },
                { id: 'faiss', label: 'FAISS (Familiarity)', tooltip: 'Dense vector indexing & similarity search (Familiarity)' },
                { id: 'tool-calling', label: 'Tool Calling', tooltip: 'Schema-bound function execution for LLM workflows' },
                { id: 'ai-agents', label: 'AI Agents', tooltip: 'Autonomous multi-step reasoning & tool orchestration' },
                { id: 'ollama', label: 'Ollama', tooltip: 'Local runtime for serving quantized open-weight LLMs' },
                { id: 'tinyllama', label: 'TinyLlama', tooltip: 'Compact open-weight language model for local inference' },
                { id: 'gemini-api', label: 'Gemini API', tooltip: 'Multimodal model inference & structured generation' },
                { id: 'mistral-api', label: 'Mistral API', tooltip: 'Hosted Mistral LLM inference & reasoning endpoints' },
                { id: 'groq-api', label: 'Groq API', tooltip: 'Low-latency LPU inference for open-weight models' }
            ]
        },
        {
            id: 'lang',
            name: 'Programming Languages',
            dirName: '04_Programming_Languages/',
            hubLabel: 'Languages',
            color: '#58a6ff',
            lightColor: '#0969da',
            skills: [
                { id: 'python', label: 'Python', tooltip: 'Primary language for ML, NLP, APIs & AST tooling' },
                { id: 'java', label: 'Java', tooltip: 'Object-oriented architecture & desktop/backend systems' },
                { id: 'javascript', label: 'JavaScript', tooltip: 'Interactive web frontends, DOM logic & canvas visuals' },
                { id: 'typescript', label: 'TypeScript', tooltip: 'Statically typed JavaScript for maintainable web apps' },
                { id: 'sql', label: 'SQL', tooltip: 'Relational queries, joins, schemas & aggregation' },
                { id: 'html5', label: 'HTML5', tooltip: 'Semantic markup, accessibility & structured metadata' },
                { id: 'css3', label: 'CSS3', tooltip: 'Responsive Grid/Flexbox layouts & design tokens' },
                { id: 'c', label: 'C (Foundational)', tooltip: 'Foundational procedural programming, pointers & memory' }
            ]
        },
        {
            id: 'backend',
            name: 'Backend & Application Engineering',
            dirName: '05_Backend_&_Application_Engineering/',
            hubLabel: 'Backend & Apps',
            color: '#39c5cf',
            lightColor: '#0f766e',
            skills: [
                { id: 'fastapi', label: 'FastAPI', tooltip: 'Async Python APIs with OpenAPI & type validation' },
                { id: 'flask', label: 'Flask', tooltip: 'Lightweight Python web services & analytics dashboards' },
                { id: 'streamlit', label: 'Streamlit', tooltip: 'Interactive web interfaces for ML & NLP models' },
                { id: 'rest-apis', label: 'REST APIs', tooltip: 'Stateless HTTP endpoints, routing & JSON contracts' },
                { id: 'pydantic', label: 'Pydantic', tooltip: 'Runtime data validation & strict schema serialization' },
                { id: 'sqlalchemy', label: 'SQLAlchemy', tooltip: 'Python SQL toolkit & ORM database modeling' },
                { id: 'sqlite', label: 'SQLite', tooltip: 'Embedded serverless relational database storage' }
            ]
        },
        {
            id: 'testing',
            name: 'Testing, Tools & Deployment',
            dirName: '06_Testing,_Tools_&_Deployment/',
            hubLabel: 'Testing & Tools',
            color: '#db61a2',
            lightColor: '#bf3989',
            skills: [
                { id: 'git', label: 'Git', tooltip: 'Distributed version control, branching & history' },
                { id: 'github', label: 'GitHub', tooltip: 'Repository hosting, collaboration & code workflows' },
                { id: 'pytest', label: 'pytest', tooltip: 'Automated unit & integration testing for Python' },
                { id: 'vitest', label: 'Vitest', tooltip: 'Fast unit testing for JavaScript & TypeScript code' },
                { id: 'jupyter', label: 'Jupyter', tooltip: 'Interactive notebooks for experiments, EDA & ML proofs' },
                { id: 'uv', label: 'uv', tooltip: 'Fast Python dependency & virtual environment tooling' },
                { id: 'vs-code', label: 'VS Code', tooltip: 'Primary IDE for ML engineering & web development' },
                { id: 'postman', label: 'Postman', tooltip: 'API endpoint testing, payloads & request inspection' },
                { id: 'render', label: 'Render', tooltip: 'Cloud hosting for Python backend services & APIs' },
                { id: 'streamlit-cloud', label: 'Streamlit Cloud', tooltip: 'Managed hosting for interactive ML Streamlit apps' }
            ]
        },
        {
            id: 'math',
            name: 'Mathematics & Computational Foundations',
            dirName: '07_Mathematics_&_Computational_Foundations/',
            hubLabel: 'Math & CS',
            color: '#bc8cff',
            lightColor: '#8250df',
            skills: [
                { id: 'linear-algebra', label: 'Linear Algebra', tooltip: 'Vectors, matrices, eigenvalues & tensor spaces' },
                { id: 'probability', label: 'Probability', tooltip: 'Random variables, Bayes theorem & distributions' },
                { id: 'statistics', label: 'Statistics', tooltip: 'Estimation, variance, correlation & data inference' },
                { id: 'hypothesis-testing', label: 'Hypothesis Testing', tooltip: 'p-values, confidence intervals & statistical tests' },
                { id: 'dsa', label: 'DSA', tooltip: 'Data Structures & Algorithms for algorithmic efficiency' },
                { id: 'oop', label: 'OOP', tooltip: 'Object-Oriented design, encapsulation & purity metrics' },
                { id: 'numerical-methods', label: 'Numerical Methods', tooltip: 'Iterative optimization, approximation & solvers' }
            ]
        }
    ];

    // Curated conceptual relationships across and within clusters (no arbitrary clutter)
    const conceptualLinks = [
        // ML <-> Math & Foundations
        ['numpy', 'linear-algebra'],
        ['numpy', 'numerical-methods'],
        ['pca', 'linear-algebra'],
        ['linear-regression', 'linear-algebra'],
        ['logistic-regression', 'probability'],
        ['probability', 'statistics'],
        ['hypothesis-testing', 'statistics'],
        ['matplotlib', 'seaborn'],
        ['pandas', 'feature-engineering'],
        ['scikit-learn', 'cross-validation'],
        ['scikit-learn', 'gridsearchcv'],
        ['scikit-learn', 'stacking-ensembles'],
        ['scikit-learn', 'voting-ensembles'],
        ['xgboost', 'cross-validation'],

        // Deep Learning & NLP
        ['python', 'scikit-learn'],
        ['python', 'pytorch'],
        ['pytorch', 'cnn'],
        ['pytorch', 'lstm'],
        ['pytorch', 'transformers'],
        ['ann', 'pytorch'],
        ['rnn', 'lstm'],
        ['tensorflow', 'keras'],
        ['transformers', 'hugging-face'],
        ['transformers', 'codebert'],
        ['codebert', 'ast-analysis'],
        ['tf-idf', 'text-classification'],
        ['stacking-ensembles', 'text-classification'],

        // Generative AI & Retrieval
        ['python', 'langchain'],
        ['langchain', 'langgraph'],
        ['langchain', 'rag'],
        ['langgraph', 'ai-agents'],
        ['tool-calling', 'ai-agents'],
        ['rag', 'embeddings'],
        ['transformers', 'embeddings'],
        ['embeddings', 'chromadb'],
        ['embeddings', 'faiss'],
        ['ollama', 'tinyllama'],

        // Languages, Backend, Testing & Deployment
        ['python', 'fastapi'],
        ['python', 'flask'],
        ['python', 'streamlit'],
        ['python', 'pytest'],
        ['python', 'uv'],
        ['python', 'dsa'],
        ['java', 'oop'],
        ['ast-analysis', 'oop'],
        ['javascript', 'typescript'],
        ['typescript', 'vitest'],
        ['html5', 'css3'],
        ['fastapi', 'pydantic'],
        ['fastapi', 'rest-apis'],
        ['rest-apis', 'postman'],
        ['sql', 'sqlalchemy'],
        ['sqlalchemy', 'sqlite'],
        ['streamlit', 'streamlit-cloud'],
        ['flask', 'render'],
        ['git', 'github']
    ];

    function getTotalSkillCount() {
        return categories.reduce((sum, cat) => sum + cat.skills.length, 0);
    }

    function getCategoryById(id) {
        return categories.find(c => c.id === id) || null;
    }

    const skillsData = {
        categories,
        conceptualLinks,
        getTotalSkillCount,
        getCategoryById
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = skillsData;
    }
    global.SKILLS_DATA = skillsData;
})(typeof window !== 'undefined' ? window : globalThis);
