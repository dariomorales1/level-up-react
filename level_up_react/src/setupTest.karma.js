// src/setupTests.karma.js
import '@testing-library/jasmine-dom';

// Mock para localStorage (sin jasmine global)
const createStorageMock = () => {
  let storage = {};
  const calls = {
    getItem: [],
    setItem: [], 
    removeItem: [],
    clear: []
  };
  
  return {
    getItem: (key) => {
      calls.getItem.push(key);
      return storage[key] || null;
    },
    setItem: (key, value) => {
      calls.setItem.push({ key, value });
      storage[key] = value.toString();
    },
    removeItem: (key) => {
      calls.removeItem.push(key);
      delete storage[key];
    },
    clear: () => {
      calls.clear.push(true);
      storage = {};
    },
    // Métodos para testing
    _getCalls: () => ({ ...calls }),
    _reset: () => {
      Object.keys(calls).forEach(key => calls[key] = []);
      storage = {};
    }
  };
};

global.localStorage = createStorageMock();
global.sessionStorage = createStorageMock();

// Mock para matchMedia
global.matchMedia = () => ({
  matches: false,
  media: '',
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
});

// Mock para FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => {
    const element = document.createElement('i');
    element.setAttribute('data-testid', 'fa-icon');
    element.textContent = 'icon';
    return element;
  }
}));

// Mock para React Router
const mockNavigate = () => {};
const mockLocation = { 
  pathname: '/',
  search: '',
  hash: '',
  state: null 
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Mock para toast
jest.mock('./components/toast', () => ({
  __esModule: true,
  default: () => {}
}));

// Cleanup después de cada test
afterEach(() => {
  global.localStorage._reset();
  global.sessionStorage._reset();
});