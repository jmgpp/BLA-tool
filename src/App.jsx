import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Nav, Navbar, Form, InputGroup, ListGroup, Badge, Tab, Tabs, Modal } from 'react-bootstrap'
import './App.css'
import dictionaryData from './data/dictionary.json'
import ErrorBoundary from './ErrorBoundary'

function App() {
  // Load data from localStorage or dictionary.json file
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : dictionaryData.categories;
  });
  
  const [terms, setTerms] = useState(() => {
    const savedTerms = localStorage.getItem('terms');
    return savedTerms ? JSON.parse(savedTerms) : dictionaryData.terms;
  });

  // Save to localStorage whenever categories or terms change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('terms', JSON.stringify(terms));
  }, [terms]);

  // Add missing state variables for ZIP code lookup
  const [zipCode, setZipCode] = useState('');
  const [location, setLocation] = useState({ city: '---', state: '---' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State for UI interactions
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  
  // Modal states
  const [showTermModal, setShowTermModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showCategoryManagerModal, setShowCategoryManagerModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showBrandTypeModal, setShowBrandTypeModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [modalAction, setModalAction] = useState('add'); // 'add' or 'edit'
  const [modalType, setModalType] = useState(''); // 'category', 'subcategory', or 'term'
  const [currentTerm, setCurrentTerm] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  
  // Form states
  const [formName, setFormName] = useState('');
  const [termForm, setTermForm] = useState({
    categoryId: '',
    subcategoryId: '',
    englishTerm: '',
    spanishTerm: '',
    notes: '',
    tags: []
  });
  const [brandForm, setBrandForm] = useState({
    name: '',
    type: 'pharmacy',
    notes: ''
  });
  const [brandTypeForm, setBrandTypeForm] = useState({
    value: '',
    label: ''
  });

  // State abbreviation to full name mapping
  const stateAbbreviations = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
  };

  // Alphabet data
  const alphabetData = [
    { letter: 'A', nato: 'Alpha', common: 'Apple' },
    { letter: 'B', nato: 'Bravo', common: 'Banana' },
    { letter: 'C', nato: 'Charlie', common: 'Cat' },
    { letter: 'D', nato: 'Delta', common: 'Dog' },
    { letter: 'E', nato: 'Echo', common: 'Elephant' },
    { letter: 'F', nato: 'Foxtrot', common: 'Fish' },
    { letter: 'G', nato: 'Golf', common: 'Grape' },
    { letter: 'H', nato: 'Hotel', common: 'House' },
    { letter: 'I', nato: 'India', common: 'Ice cream' },
    { letter: 'J', nato: 'Juliet', common: 'Juice' },
    { letter: 'K', nato: 'Kilo', common: 'Kite' },
    { letter: 'L', nato: 'Lima', common: 'Lemon' },
    { letter: 'M', nato: 'Mike', common: 'Milk' },
    { letter: 'N', nato: 'November', common: 'Nest' },
    { letter: 'O', nato: 'Oscar', common: 'Orange' },
    { letter: 'P', nato: 'Papa', common: 'Pizza' },
    { letter: 'Q', nato: 'Quebec', common: 'Queen' },
    { letter: 'R', nato: 'Romeo', common: 'Rainbow' },
    { letter: 'S', nato: 'Sierra', common: 'Sun' },
    { letter: 'T', nato: 'Tango', common: 'Tomato' },
    { letter: 'U', nato: 'Uniform', common: 'Umbrella' },
    { letter: 'V', nato: 'Victor', common: 'Violin' },
    { letter: 'W', nato: 'Whiskey', common: 'Water' },
    { letter: 'X', nato: 'X-ray', common: 'X-ray' },
    { letter: 'Y', nato: 'Yankee', common: 'Yellow' },
    { letter: 'Z', nato: 'Zulu', common: 'Zebra' }
  ];

  // Street Suffix data
  const streetSuffixData = [
    { full: 'Alley', abbr: 'ALY' },
    { full: 'Annex', abbr: 'ANX' },
    { full: 'Arcade', abbr: 'ARC' },
    { full: 'Avenue', abbr: 'AVE' },
    { full: 'Bayou', abbr: 'YU' },
    { full: 'Beach', abbr: 'BCH' },
    { full: 'Bend', abbr: 'BND' },
    { full: 'Bluff', abbr: 'BLF' },
    { full: 'Bottom', abbr: 'BTM' },
    { full: 'Boulevard', abbr: 'BLVD' },
    { full: 'Branch', abbr: 'BR' },
    { full: 'Bridge', abbr: 'BRG' },
    { full: 'Brook', abbr: 'BRK' },
    { full: 'Burg', abbr: 'BG' },
    { full: 'Bypass', abbr: 'BYP' },
    { full: 'Camp', abbr: 'CP' },
    { full: 'Canyon', abbr: 'CYN' },
    { full: 'Cape', abbr: 'CPE' },
    { full: 'Causeway', abbr: 'CSWY' },
    { full: 'Center', abbr: 'CTR' },
    { full: 'Circle', abbr: 'CIR' },
    { full: 'Cliffs', abbr: 'CLFS' },
    { full: 'Club', abbr: 'CLB' },
    { full: 'Corner', abbr: 'COR' },
    { full: 'Corners', abbr: 'CORS' },
    { full: 'Course', abbr: 'CRSE' },
    { full: 'Court', abbr: 'CT' },
    { full: 'Courts', abbr: 'CTS' },
    { full: 'Cove', abbr: 'CV' },
    { full: 'Creek', abbr: 'CRK' },
    { full: 'Crescent', abbr: 'CRES' },
    { full: 'Crossing', abbr: 'XING' },
    { full: 'Dale', abbr: 'DL' },
    { full: 'Dam', abbr: 'DM' },
    { full: 'Divide', abbr: 'DV' },
    { full: 'Drive', abbr: 'DR' },
    { full: 'Estates', abbr: 'EST' },
    { full: 'Expressway', abbr: 'EXPY' },
    { full: 'Extension', abbr: 'EXT' },
    { full: 'Fall', abbr: 'FALL' },
    { full: 'Falls', abbr: 'FLS' },
    { full: 'Ferry', abbr: 'FRY' },
    { full: 'Field', abbr: 'FLD' },
    { full: 'Fields', abbr: 'FLDS' },
    { full: 'Flats', abbr: 'FLT' },
    { full: 'Ford', abbr: 'FOR' },
    { full: 'Forest', abbr: 'FRST' },
    { full: 'Forge', abbr: 'FGR' },
    { full: 'Fork', abbr: 'FORK' },
    { full: 'Forks', abbr: 'FRKS' },
    { full: 'Fort', abbr: 'FT' },
    { full: 'Freeway', abbr: 'FWY' },
    { full: 'Gardens', abbr: 'GDNS' },
    { full: 'Gateway', abbr: 'GTWY' },
    { full: 'Glen', abbr: 'GLN' },
    { full: 'Green', abbr: 'GN' },
    { full: 'Grove', abbr: 'GRV' },
    { full: 'Harbor', abbr: 'HBR' },
    { full: 'Haven', abbr: 'HVN' },
    { full: 'Heights', abbr: 'HTS' },
    { full: 'Highway', abbr: 'HWY' },
    { full: 'Hill', abbr: 'HL' },
    { full: 'Hills', abbr: 'HLS' },
    { full: 'Hollow', abbr: 'HOLW' },
    { full: 'Inlet', abbr: 'INLT' },
    { full: 'Island', abbr: 'IS' },
    { full: 'Islands', abbr: 'ISS' },
    { full: 'Isle', abbr: 'ISLE' },
    { full: 'Junction', abbr: 'JCT' },
    { full: 'Key', abbr: 'CY' },
    { full: 'Knolls', abbr: 'KNLS' },
    { full: 'Lake', abbr: 'LK' },
    { full: 'Lakes', abbr: 'LKS' },
    { full: 'Landing', abbr: 'LNDG' },
    { full: 'Lane', abbr: 'LN' },
    { full: 'Light', abbr: 'LGT' },
    { full: 'Loaf', abbr: 'LF' },
    { full: 'Locks', abbr: 'LCKS' },
    { full: 'Lodge', abbr: 'LDG' },
    { full: 'Loop', abbr: 'LOOP' },
    { full: 'Mall', abbr: 'MALL' },
    { full: 'Manor', abbr: 'MNR' },
    { full: 'Meadows', abbr: 'MDWS' },
    { full: 'Mill', abbr: 'ML' },
    { full: 'Mills', abbr: 'MLS' },
    { full: 'Mission', abbr: 'MSN' },
    { full: 'Mount', abbr: 'MT' },
    { full: 'Mountain', abbr: 'MTN' },
    { full: 'Neck', abbr: 'NCK' },
    { full: 'Orchard', abbr: 'ORCH' },
    { full: 'Oval', abbr: 'OVAL' },
    { full: 'Park', abbr: 'PARK' },
    { full: 'Parkway', abbr: 'PKY' },
    { full: 'Pass', abbr: 'PASS' },
    { full: 'Path', abbr: 'PATH' },
    { full: 'Pike', abbr: 'PIKE' },
    { full: 'Pines', abbr: 'PNES' },
    { full: 'Place', abbr: 'PL' },
    { full: 'Plain', abbr: 'PLN' },
    { full: 'Plains', abbr: 'PLNS' },
    { full: 'Plaza', abbr: 'PLZ' },
    { full: 'Point', abbr: 'PT' },
    { full: 'Port', abbr: 'PRT' },
    { full: 'Prairie', abbr: 'PR' },
    { full: 'Radial', abbr: 'RADL' },
    { full: 'Ranch', abbr: 'RNCH' },
    { full: 'Rapids', abbr: 'RPDS' },
    { full: 'Rest', abbr: 'RST' },
    { full: 'Ridge', abbr: 'RDG' },
    { full: 'River', abbr: 'RIV' },
    { full: 'Road', abbr: 'RD' },
    { full: 'Row', abbr: 'ROW' },
    { full: 'Run', abbr: 'RUN' },
    { full: 'Shoal', abbr: 'SHL' },
    { full: 'Shoals', abbr: 'SHLS' },
    { full: 'Shore', abbr: 'SHR' },
    { full: 'Shores', abbr: 'SHRS' },
    { full: 'Spring', abbr: 'SPG' },
    { full: 'Springs', abbr: 'SPGS' },
    { full: 'Spur', abbr: 'SPUR' },
    { full: 'Square', abbr: 'SQ' },
    { full: 'Station', abbr: 'STA' },
    { full: 'Stravenues', abbr: 'STRA' },
    { full: 'Stream', abbr: 'STRM' },
    { full: 'Street', abbr: 'ST' },
    { full: 'Summit', abbr: 'SMT' },
    { full: 'Terrace', abbr: 'TER' },
    { full: 'Trace', abbr: 'TRCE' },
    { full: 'Track', abbr: 'TRAK' },
    { full: 'Trail', abbr: 'TRL' },
    { full: 'Trailer', abbr: 'TRLR' },
    { full: 'Tunnel', abbr: 'TUNL' },
    { full: 'Turnpike', abbr: 'TPKE' },
    { full: 'Union', abbr: 'UN' },
    { full: 'Valley', abbr: 'VLY' },
    { full: 'Viaduct', abbr: 'VIA' },
    { full: 'View', abbr: 'VW' },
    { full: 'Village', abbr: 'VLG' },
    { full: 'Ville', abbr: 'VL' },
    { full: 'Vista', abbr: 'VIS' },
    { full: 'Walk', abbr: 'WALK' },
    { full: 'Way', abbr: 'WAY' },
    { full: 'Wells', abbr: 'WLS' }
  ]

  // Street Suffix search state
  const [streetSuffixSearch, setStreetSuffixSearch] = useState('');

  // Filter street suffixes based on search
  const filteredStreetSuffixes = streetSuffixData.filter(item =>
    item.abbr.toLowerCase().includes(streetSuffixSearch.toLowerCase()) ||
    item.full.toLowerCase().includes(streetSuffixSearch.toLowerCase())
  );

  // Get sorted categories
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  // Get sorted subcategories for a category
  const getSortedSubcategories = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    return [...category.subcategories].sort((a, b) => a.name.localeCompare(b.name));
  };

  // Filter terms based on search and category filters, then sort alphabetically by English term
  const filteredTerms = terms
    .filter(term => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        term.englishTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.spanishTerm.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category and subcategory
      const matchesCategory = selectedCategory === null || term.categoryId === selectedCategory;
      const matchesSubcategory = selectedSubcategory === null || term.subcategoryId === selectedSubcategory;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    })
    .sort((a, b) => a.englishTerm.toLowerCase().localeCompare(b.englishTerm.toLowerCase()));

  // Get the category and subcategory names for a term
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const getSubcategoryName = (categoryId, subcategoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return '';
    
    const subcategory = category.subcategories.find(subcat => subcat.id === subcategoryId);
    return subcategory ? subcategory.name : '';
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  // Open Category Modal
  const openCategoryModal = (action, category = null) => {
    setModalAction(action);
    setModalType('category');
    setCurrentCategory(category);
    setFormName(category ? category.name : '');
    setShowCategoryModal(true);
  };

  // Open Subcategory Modal
  const openSubcategoryModal = (action, categoryId, subcategory = null) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category && action !== 'add') return;
    
    setModalAction(action);
    setModalType('subcategory');
    setCurrentCategory(category);
    setCurrentSubcategory(subcategory);
    setFormName(subcategory ? subcategory.name : '');
    setShowSubcategoryModal(true);
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (type, item) => {
    setModalType(type);
    if (type === 'category') {
      setCurrentCategory(item);
      setCurrentSubcategory(null);
      setCurrentTerm(null);
    } else if (type === 'subcategory') {
      setCurrentSubcategory(item);
      setCurrentCategory(categories.find(cat => 
        cat.subcategories.some(subcat => subcat.id === item.id)
      ));
      setCurrentTerm(null);
    } else if (type === 'term') {
      setCurrentTerm(item);
      setCurrentCategory(null);
      setCurrentSubcategory(null);
    }
    setShowDeleteModal(true);
  };

  // Handle term form changes
  const handleTermFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'categoryId') {
      // When category changes, reset subcategory
      setTermForm({
        ...termForm,
        [name]: value ? parseInt(value) : '',
        subcategoryId: ''
      });
    } else if (name === 'subcategoryId') {
      setTermForm({
        ...termForm,
        [name]: value ? parseInt(value) : ''
      });
    } else if (name === 'newTag') {
      // Don't update form state for tag input
      return;
    } else {
      setTermForm({
        ...termForm,
        [name]: value
      });
    }
  };

  // Handle adding a new tag
  const handleAddTag = (tag) => {
    if (!tag.trim() || termForm.tags.includes(tag.trim())) return;
    setTermForm({
      ...termForm,
      tags: [...termForm.tags, tag.trim()]
    });
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setTermForm({
      ...termForm,
      tags: termForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Handle form submission for categories
  const handleSaveCategory = () => {
    if (!formName.trim()) return;

    if (modalAction === 'add') {
      // Find the highest category ID and order
      const maxId = Math.max(0, ...categories.map(cat => cat.id));
      const maxOrder = Math.max(0, ...categories.map(cat => cat.order));
      
      // Add new category
      const newCategory = {
        id: maxId + 1,
        name: formName.trim(),
        order: maxOrder + 1,
        subcategories: []
      };
      
      setCategories([...categories, newCategory]);
    } else if (modalAction === 'edit' && currentCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === currentCategory.id 
          ? { ...cat, name: formName.trim() } 
          : cat
      ));
    }
    
    setShowCategoryModal(false);
  };

  // Handle subcategory form submission
  const handleSaveSubcategory = () => {
    if (!formName.trim() || !currentCategory) return;

    if (modalAction === 'add') {
      // Find the highest subcategory ID
      const allSubcategories = categories.flatMap(cat => cat.subcategories);
      const maxId = Math.max(0, ...allSubcategories.map(subcat => subcat.id));
      
      // Create new subcategory
      const newSubcategory = {
        id: maxId + 1,
        name: formName.trim()
      };
      
      // Add to current category
      setCategories(categories.map(cat => 
        cat.id === currentCategory.id 
          ? { 
              ...cat, 
              subcategories: [...cat.subcategories, newSubcategory]
            } 
          : cat
      ));
    } else if (modalAction === 'edit' && currentSubcategory) {
      // Update existing subcategory
      setCategories(categories.map(cat => 
        cat.id === currentCategory.id 
          ? { 
              ...cat, 
              subcategories: cat.subcategories.map(subcat => 
                subcat.id === currentSubcategory.id 
                  ? { ...subcat, name: formName.trim() } 
                  : subcat
              ) 
            } 
          : cat
      ));
    }
    
    setShowSubcategoryModal(false);
  };

  // Handle term form submission
  const handleSaveTerm = () => {
    // Validate form
    if (!termForm.englishTerm.trim() || !termForm.spanishTerm.trim() || 
        !termForm.categoryId || !termForm.subcategoryId) {
      alert('Please fill in all required fields');
      return;
    }

    if (modalAction === 'add') {
      // Find the highest term ID
      const maxId = Math.max(0, ...terms.map(term => term.id));
      
      // Create new term
      const newTerm = {
        id: maxId + 1,
        categoryId: termForm.categoryId,
        subcategoryId: termForm.subcategoryId,
        englishTerm: termForm.englishTerm.trim(),
        spanishTerm: termForm.spanishTerm.trim(),
        notes: termForm.notes.trim(),
        tags: termForm.tags
      };
      
      // Add to terms
      setTerms([...terms, newTerm]);
    } else if (modalAction === 'edit' && currentTerm) {
      // Update existing term
      setTerms(terms.map(term => 
        term.id === currentTerm.id 
          ? {
              ...term,
              categoryId: termForm.categoryId,
              subcategoryId: termForm.subcategoryId,
              englishTerm: termForm.englishTerm.trim(),
              spanishTerm: termForm.spanishTerm.trim(),
              notes: termForm.notes.trim(),
              tags: termForm.tags
            } 
          : term
      ));
    }
    
    setShowTermModal(false);
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (modalType === 'category' && currentCategory) {
      // Check if category has terms
      const hasTerms = terms.some(term => term.categoryId === currentCategory.id);
      if (hasTerms) {
        alert('Cannot delete category that has terms. Please delete or reassign terms first.');
        setShowDeleteModal(false);
        return;
      }
      
      // Delete category
      setCategories(categories.filter(cat => cat.id !== currentCategory.id));
      
      // Reset selection if the deleted category was selected
      if (selectedCategory === currentCategory.id) {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
      }
    } else if (modalType === 'subcategory' && currentSubcategory && currentCategory) {
      // Check if subcategory has terms
      const hasTerms = terms.some(term => 
        term.subcategoryId === currentSubcategory.id &&
        term.categoryId === currentCategory.id
      );
      
      if (hasTerms) {
        alert('Cannot delete subcategory that has terms. Please delete or reassign terms first.');
        setShowDeleteModal(false);
        return;
      }
      
      // Delete subcategory
      setCategories(categories.map(cat => 
        cat.id === currentCategory.id 
          ? { 
              ...cat, 
              subcategories: cat.subcategories.filter(subcat => subcat.id !== currentSubcategory.id) 
            } 
          : cat
      ));
      
      // Reset subcategory selection if the deleted one was selected
      if (selectedSubcategory === currentSubcategory.id) {
        setSelectedSubcategory(null);
      }
    } else if (modalType === 'term' && currentTerm) {
      // Delete term
      setTerms(terms.filter(term => term.id !== currentTerm.id));
    }
    
    setShowDeleteModal(false);
  };

  // Move category up or down in order
  const moveCategory = (categoryId, direction) => {
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) return;
    
    const newCategories = [...categories];
    const category = newCategories[categoryIndex];
    
    if (direction === 'up' && categoryIndex > 0) {
      // Swap order with the category above
      const prevCategory = newCategories[categoryIndex - 1];
      const tempOrder = category.order;
      category.order = prevCategory.order;
      prevCategory.order = tempOrder;
    } else if (direction === 'down' && categoryIndex < categories.length - 1) {
      // Swap order with the category below
      const nextCategory = newCategories[categoryIndex + 1];
      const tempOrder = category.order;
      category.order = nextCategory.order;
      nextCategory.order = tempOrder;
    }
    
    setCategories(newCategories);
  };

  // Handle zip code lookup
  const handleZipLookup = async () => {
    if (!zipCode || zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (!response.ok) {
        throw new Error('ZIP code not found');
      }

      const data = await response.json();
      const stateAbbr = data.places[0]['state abbreviation'];
      setLocation({
        city: data.places[0]['place name'],
        state: stateAbbreviations[stateAbbr] || stateAbbr
      });
    } catch (err) {
      setLocation({ city: '---', state: '---' });
      setError(err.message === 'ZIP code not found' ? 'ZIP code not found' : 'Error looking up ZIP code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle zip code input change
  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
    setError('');
  };

  // Brands & Names data and state
  const [brands, setBrands] = useState(() => {
    const savedBrands = localStorage.getItem('brands');
    return savedBrands ? JSON.parse(savedBrands) : [
      { id: 1, name: 'CVS Pharmacy', type: 'pharmacy', notes: 'National pharmacy chain' },
      { id: 2, name: 'Walgreens', type: 'pharmacy', notes: 'Major pharmacy retailer' },
      { id: 3, name: 'Mayo Clinic', type: 'clinic', notes: 'Renowned medical center' },
      { id: 4, name: 'Blue Cross Blue Shield', type: 'insurance', notes: 'Major health insurance provider' },
      { id: 5, name: 'UnitedHealthcare', type: 'insurance', notes: 'Large insurance company' },
      { id: 6, name: 'Kaiser Permanente', type: 'clinic', notes: 'Healthcare provider and insurance' }
    ];
  });

  // Brand types state
  const [brandTypes, setBrandTypes] = useState(() => {
    const savedBrandTypes = localStorage.getItem('brandTypes');
    return savedBrandTypes ? JSON.parse(savedBrandTypes) : [
      { id: 1, value: 'pharmacy', label: 'Pharmacies' },
      { id: 2, value: 'clinic', label: 'Clinics & Hospitals' },
      { id: 3, value: 'insurance', label: 'Insurance Companies' }
    ];
  });

  // Save brands and brand types to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('brandTypes', JSON.stringify(brandTypes));
  }, [brandTypes]);

  const [brandSearch, setBrandSearch] = useState('');
  const [selectedBrandType, setSelectedBrandType] = useState('all');
  const [currentBrand, setCurrentBrand] = useState(null);
  const [currentBrandType, setCurrentBrandType] = useState(null);

  // Handle brand type form changes
  const handleBrandTypeFormChange = (e) => {
    const { name, value } = e.target;
    setBrandTypeForm({
      ...brandTypeForm,
      [name]: value,
      // Auto-generate the value (ID) from the label
      value: name === 'label' ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : brandTypeForm.value
    });
  };

  // Open brand type modal
  const openBrandTypeModal = (action, type = null) => {
    setModalAction(action);
    setCurrentBrandType(type);
    
    if (action === 'add') {
      setBrandTypeForm({
        value: '',
        label: ''
      });
    } else if (action === 'edit' && type) {
      setBrandTypeForm({
        value: type.value,
        label: type.label
      });
    }
    
    setShowBrandTypeModal(true);
  };

  // Handle brand type form submission
  const handleSaveBrandType = () => {
    if (!brandTypeForm.label.trim()) return;

    // Ensure we have a valid value (ID)
    const typeValue = brandTypeForm.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (modalAction === 'add') {
      const maxId = Math.max(0, ...brandTypes.map(type => type.id));
      const newType = {
        id: maxId + 1,
        value: typeValue,
        label: brandTypeForm.label.trim()
      };
      setBrandTypes([...brandTypes, newType]);
    } else if (modalAction === 'edit' && currentBrandType) {
      setBrandTypes(brandTypes.map(type =>
        type.id === currentBrandType.id
          ? {
              ...type,
              value: typeValue,
              label: brandTypeForm.label.trim()
            }
          : type
      ));

      // Update all brands that use this type
      const oldValue = currentBrandType.value;
      setBrands(brands.map(brand =>
        brand.type === oldValue
          ? { ...brand, type: typeValue }
          : brand
      ));
    }
    
    setShowBrandTypeModal(false);
  };

  // Handle brand type deletion
  const handleDeleteBrandType = (typeId) => {
    const typeToDelete = brandTypes.find(type => type.id === typeId);
    if (!typeToDelete) return;

    // Check if any brands are using this type
    const brandsUsingType = brands.filter(brand => brand.type === typeToDelete.value);
    if (brandsUsingType.length > 0) {
      alert(`Cannot delete this type as it is being used by ${brandsUsingType.length} brand(s). Please reassign or delete those brands first.`);
      return;
    }

    setBrandTypes(brandTypes.filter(type => type.id !== typeId));
    setShowBrandTypeModal(false);
  };

  // Filter brands based on search and type
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(brandSearch.toLowerCase()) ||
                         brand.notes.toLowerCase().includes(brandSearch.toLowerCase());
    const matchesType = selectedBrandType === 'all' || brand.type === selectedBrandType;
    return matchesSearch && matchesType;
  });

  // Handle brand form changes
  const handleBrandFormChange = (e) => {
    const { name, value } = e.target;
    setBrandForm({
      ...brandForm,
      [name]: value
    });
  };

  // Open brand modal
  const openBrandModal = (action, brand = null) => {
    setModalAction(action);
    setCurrentBrand(brand);
    
    if (action === 'add') {
      setBrandForm({
        name: '',
        type: 'pharmacy',
        notes: ''
      });
    } else if (action === 'edit' && brand) {
      setBrandForm({
        name: brand.name,
        type: brand.type,
        notes: brand.notes || ''
      });
    }
    
    setShowBrandModal(true);
  };

  // Handle brand form submission
  const handleSaveBrand = () => {
    if (!brandForm.name.trim()) return;

    if (modalAction === 'add') {
      const maxId = Math.max(0, ...brands.map(brand => brand.id));
      const newBrand = {
        id: maxId + 1,
        name: brandForm.name.trim(),
        type: brandForm.type,
        notes: brandForm.notes.trim()
      };
      setBrands([...brands, newBrand]);
    } else if (modalAction === 'edit' && currentBrand) {
      setBrands(brands.map(brand =>
        brand.id === currentBrand.id
          ? {
              ...brand,
              name: brandForm.name.trim(),
              type: brandForm.type,
              notes: brandForm.notes.trim()
            }
          : brand
      ));
    }
    
    setShowBrandModal(false);
  };

  // Handle brand deletion
  const handleDeleteBrand = (brandId) => {
    setBrands(brands.filter(brand => brand.id !== brandId));
  };

  // Open Term Modal
  const openTermModal = (action, term = null) => {
    setModalAction(action);
    setCurrentTerm(term);
    
    if (action === 'add') {
      // For a new term, initialize with default values or selected category
      setTermForm({
        categoryId: selectedCategory || '',
        subcategoryId: selectedSubcategory || '',
        englishTerm: '',
        spanishTerm: '',
        notes: '',
        tags: []
      });
    } else if (action === 'edit' && term) {
      // For editing, populate form with term data
      setTermForm({
        categoryId: term.categoryId,
        subcategoryId: term.subcategoryId,
        englishTerm: term.englishTerm,
        spanishTerm: term.spanishTerm,
        notes: term.notes || '',
        tags: term.tags || []
      });
    }
    
    setShowTermModal(true);
  };

  // Determine which term to delete and open delete modal
  const openDeleteTermModal = (termId) => {
    setCurrentTerm(terms.find(term => term.id === termId));
    setModalType('term');
    setShowDeleteModal(true);
  };

  // Open Category Manager Modal
  const openCategoryManagerModal = () => {
    setShowCategoryManagerModal(true);
  };

  // Open About modal
  const openAboutModal = () => {
    setShowAboutModal(true);
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Navbar Component */}
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
          <Container>
            <Navbar.Brand href="#home">BLA-tool by Juan</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={openAboutModal}>About</Nav.Link>
              </Nav>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => {
                    const dataStr = JSON.stringify({ categories, terms }, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'dictionary-export.json';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <i className="bi bi-download me-1"></i>
                  Export Data
                </Button>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target.result);
                            if (data.categories && data.terms) {
                              setCategories(data.categories);
                              setTerms(data.terms);
                              alert('Data imported successfully!');
                            } else {
                              alert('Invalid file format. File must contain categories and terms.');
                            }
                          } catch (error) {
                            alert('Error importing file: ' + error.message);
                          }
                        };
                        reader.readAsText(file);
                      }
                    };
                    input.click();
                  }}
                >
                  <i className="bi bi-upload me-1"></i>
                  Import Data
                </Button>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container fluid className="main-content">
          <Row>
            {/* Main Panel - Terms List (takes about half the screen) */}
            <Col md={7} className="terms-panel">
              <Card className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Translation Terms</h5>
                  <div>
                    <Button variant="outline-secondary" className="me-2" onClick={openCategoryManagerModal}>
                      <i className="bi bi-gear-fill me-1"></i> Edit Categories
                    </Button>
                    <Button variant="success" onClick={() => openTermModal('add')}>
                      <i className="bi bi-plus-circle me-1"></i> Add New Term
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {/* Search Bar */}
                  <Row className="mb-3">
                    <Col>
                      <InputGroup>
                        <Form.Control
                          placeholder="Search terms in English or Spanish..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                          Clear
                        </Button>
                      </InputGroup>
                    </Col>
                  </Row>

                  {/* Categories as Buttons */}
                  <div className="categories-row mb-3">
                    <h6 className="mb-2">Categories:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      <Button 
                        variant={selectedCategory === null ? "primary" : "outline-primary"}
                        onClick={() => {
                          setSelectedCategory(null);
                          setSelectedSubcategory(null);
                        }}
                      >
                        All
                      </Button>
                      {sortedCategories.map(category => (
                        <Button 
                          key={category.id} 
                          variant={selectedCategory === category.id ? "primary" : "outline-primary"}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setSelectedSubcategory(null);
                          }}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Subcategories as Buttons - Only show when a category is selected */}
                  {selectedCategory && (
                    <div className="subcategories-row mb-3">
                      <h6 className="mb-2">Subcategories:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        <Button 
                          variant={selectedSubcategory === null ? "secondary" : "outline-secondary"}
                          onClick={() => setSelectedSubcategory(null)}
                        >
                          All
                        </Button>
                        {getSortedSubcategories(selectedCategory).map(subcat => (
                          <Button 
                            key={subcat.id} 
                            variant={selectedSubcategory === subcat.id ? "secondary" : "outline-secondary"}
                            onClick={() => setSelectedSubcategory(subcat.id)}
                          >
                            {subcat.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reset Filters */}
                  {(selectedCategory || searchTerm) && (
                    <div className="mb-3 text-end">
                      <Button variant="outline-secondary" size="sm" onClick={resetFilters}>
                        <i className="bi bi-x-circle me-1"></i>Reset All Filters
                      </Button>
                    </div>
                  )}

                  {/* Term Count */}
                  <div className="mb-3">
                    <span className="text-muted">
                      Showing {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'}
                      {terms.length !== filteredTerms.length && ` (of ${terms.length} total)`}
                    </span>
                  </div>

                  {/* Terms List */}
                  <ListGroup>
                    {filteredTerms.length > 0 ? (
                      filteredTerms.map(term => (
                        <ListGroup.Item 
                          key={term.id} 
                          className="term-item"
                          onClick={() => {
                            const updatedTerms = terms.map(t => 
                              t.id === term.id ? { ...t, showTags: !t.showTags } : t
                            );
                            setTerms(updatedTerms);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="term-translation">
                                <span className="english-term">{term.englishTerm}</span>
                                <span className="translation-arrow">→</span>
                                <span className="spanish-term">{term.spanishTerm}</span>
                              </div>
                              {term.notes && <div className="term-notes">{term.notes}</div>}
                              {term.tags && term.tags.length > 0 && term.showTags && (
                                <div className="mt-2 d-flex flex-wrap gap-1">
                                  {term.tags.map((tag, index) => (
                                    <Badge 
                                      key={index} 
                                      bg="light" 
                                      text="dark" 
                                      className="tag-badge"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openTermModal('edit', term);
                                }}
                              >
                                <i className="bi bi-pencil me-1"></i>Edit
                              </Button>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item className="text-center text-muted">
                        No terms found. Try adjusting your search or filters.
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* Side Panel - Zip Code Lookup Widget and Alphabet */}
            <Col md={5} className="side-panel">
              <Card>
                <Card.Body>
                  <div className="zip-lookup-widget mb-3">
                    <Form className="mb-2" onSubmit={(e) => { e.preventDefault(); handleZipLookup(); }}>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Enter ZIP code"
                          maxLength="5"
                          pattern="[0-9]*"
                          value={zipCode}
                          onChange={handleZipChange}
                          isInvalid={!!error}
                        />
                        <Button 
                          variant="primary" 
                          onClick={handleZipLookup}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <i className="bi bi-hourglass-split"></i>
                          ) : (
                            <i className="bi bi-search"></i>
                          )}
                        </Button>
                      </InputGroup>
                      {error && (
                        <Form.Text className="text-danger small">
                          {error}
                        </Form.Text>
                      )}
                    </Form>
                    <div className="zip-result p-2 bg-light rounded">
                      <div className="location-info">
                        <p className="mb-1 small">
                          <strong>City: </strong>
                          <span className={`${location.city === '---' ? 'text-muted' : 'text-primary'}`}>
                            {location.city}
                          </span>
                        </p>
                        <p className="mb-0 small">
                          <strong>State: </strong>
                          <span className={`${location.state === '---' ? 'text-muted' : 'text-primary'}`}>
                            {location.state}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultActiveKey="alphabet" className="mb-3">
                    <Tab eventKey="alphabet" title="Alphabet">
                      <div className="alphabet-list">
                        <ListGroup variant="flush">
                          {alphabetData.map(item => (
                            <ListGroup.Item key={item.letter} className="py-2">
                              <div className="d-flex align-items-center">
                                <span className="letter-badge">{item.letter}</span>
                                <div className="ms-3">
                                  <div className="nato-word">{item.nato}</div>
                                  <div className="common-word text-muted small">{item.common}</div>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    </Tab>
                    <Tab eventKey="street" title="Street Suffixes">
                      <div className="street-suffix-list">
                        <Form className="mb-3">
                          <InputGroup>
                            <Form.Control
                              type="text"
                              placeholder="Search street suffixes..."
                              value={streetSuffixSearch}
                              onChange={(e) => setStreetSuffixSearch(e.target.value)}
                            />
                            {streetSuffixSearch && (
                              <Button 
                                variant="outline-secondary"
                                onClick={() => setStreetSuffixSearch('')}
                              >
                                <i className="bi bi-x"></i>
                              </Button>
                            )}
                          </InputGroup>
                        </Form>
                        <ListGroup variant="flush">
                          {filteredStreetSuffixes.map(item => (
                            <ListGroup.Item key={item.abbr} className="py-2">
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="suffix-abbr">{item.abbr}</span>
                                <span className="suffix-full text-muted">{item.full}</span>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    </Tab>
                    <Tab eventKey="brands" title="Brands & Names">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <Form.Group className="d-flex gap-2 flex-grow-1 me-2">
                          <InputGroup>
                            <Form.Control
                              type="text"
                              placeholder="Search brands..."
                              value={brandSearch}
                              onChange={(e) => setBrandSearch(e.target.value)}
                            />
                            {brandSearch && (
                              <Button 
                                variant="outline-secondary"
                                onClick={() => setBrandSearch('')}
                              >
                                <i className="bi bi-x"></i>
                              </Button>
                            )}
                          </InputGroup>
                          <div className="d-flex gap-2">
                            <Form.Select 
                              value={selectedBrandType}
                              onChange={(e) => setSelectedBrandType(e.target.value)}
                              style={{ width: 'auto' }}
                            >
                              <option value="all">All Types</option>
                              {brandTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </Form.Select>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => openBrandTypeModal('add')}
                              title="Manage Types"
                            >
                              <i className="bi bi-gear"></i>
                            </Button>
                          </div>
                        </Form.Group>
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => openBrandModal('add')}
                        >
                          <i className="bi bi-plus-circle me-1"></i>Add
                        </Button>
                      </div>

                      <ListGroup variant="flush">
                        {filteredBrands.map(brand => (
                          <ListGroup.Item 
                            key={brand.id} 
                            className="py-2 d-flex justify-content-between align-items-start"
                          >
                            <div>
                              <div className="fw-500">{brand.name}</div>
                              {brand.notes && (
                                <div className="text-muted small">{brand.notes}</div>
                              )}
                            </div>
                            <div className="d-flex align-items-center">
                              <Badge 
                                bg="info" 
                                className="me-2"
                                style={{ textTransform: 'capitalize' }}
                              >
                                {brand.type}
                              </Badge>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-1"
                                onClick={() => openBrandModal('edit', brand)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => {
                                  setCurrentBrand(brand);
                                  openDeleteModal('brand', brand);
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        
        {/* Category Modal */}
        <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalAction === 'add' ? 'Add New Category' : 'Edit Category'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="categoryName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter category name" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  autoFocus
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveCategory}
              disabled={!formName.trim()}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Subcategory Modal */}
        <Modal show={showSubcategoryModal} onHide={() => setShowSubcategoryModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalAction === 'add' ? 'Add New Subcategory' : 'Edit Subcategory'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="categoryParent" className="mb-3">
                <Form.Label>Parent Category</Form.Label>
                <Form.Control 
                  type="text" 
                  value={currentCategory ? currentCategory.name : ''}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="subcategoryName">
                <Form.Label>Subcategory Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter subcategory name" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  autoFocus
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSubcategoryModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveSubcategory}
              disabled={!formName.trim()}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Term Modal */}
        <Modal show={showTermModal} onHide={() => setShowTermModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalAction === 'add' ? 'Add New Term' : 'Edit Term'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="termCategory" className="mb-3">
                <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  name="categoryId"
                  value={termForm.categoryId}
                  onChange={handleTermFormChange}
                  required
                >
                  <option value="">Select Category</option>
                  {sortedCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="termSubcategory" className="mb-3">
                <Form.Label>Subcategory <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  name="subcategoryId"
                  value={termForm.subcategoryId}
                  onChange={handleTermFormChange}
                  disabled={!termForm.categoryId}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {termForm.categoryId && getSortedSubcategories(termForm.categoryId).map(subcat => (
                    <option key={subcat.id} value={subcat.id}>
                      {subcat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="termEnglish" className="mb-3">
                <Form.Label>English Term <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  name="englishTerm"
                  placeholder="Enter English term" 
                  value={termForm.englishTerm}
                  onChange={handleTermFormChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="termSpanish" className="mb-3">
                <Form.Label>Spanish Translation <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  name="spanishTerm"
                  placeholder="Enter Spanish translation" 
                  value={termForm.spanishTerm}
                  onChange={handleTermFormChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="termNotes" className="mb-3">
                <Form.Label>Notes (Optional)</Form.Label>
                <Form.Control 
                  as="textarea" 
                  name="notes"
                  rows={3}
                  placeholder="Enter additional notes or context" 
                  value={termForm.notes}
                  onChange={handleTermFormChange}
                />
              </Form.Group>

              <Form.Group controlId="termTags">
                <Form.Label>Tags</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control
                    type="text"
                    name="newTag"
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const value = e.target.value.replace(',', '');
                        if (value.trim()) {
                          handleAddTag(value);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={(e) => {
                      const input = e.target.closest('.input-group').querySelector('input');
                      handleAddTag(input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </InputGroup>
                <div className="d-flex flex-wrap gap-2">
                  {termForm.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      bg="secondary" 
                      className="d-flex align-items-center"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <i className="bi bi-x ms-1"></i>
                    </Badge>
                  ))}
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {modalAction === 'edit' && (
              <Button 
                variant="danger" 
                className="me-auto"
                onClick={() => {
                  setShowTermModal(false);
                  openDeleteModal('term', currentTerm);
                }}
              >
                <i className="bi bi-trash me-1"></i>Delete
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowTermModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveTerm}
              disabled={!termForm.englishTerm.trim() || !termForm.spanishTerm.trim() || !termForm.categoryId || !termForm.subcategoryId}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === 'category' && (
              <p>
                Are you sure you want to delete the category <strong>{currentCategory?.name}</strong>?
                This will also delete all of its subcategories.
              </p>
            )}
            {modalType === 'subcategory' && (
              <p>
                Are you sure you want to delete the subcategory <strong>{currentSubcategory?.name}</strong>?
              </p>
            )}
            {modalType === 'term' && (
              <p>
                Are you sure you want to delete the term <strong>{currentTerm?.englishTerm}</strong> → <strong>{currentTerm?.spanishTerm}</strong>?
              </p>
            )}
            <p className="text-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              This action cannot be undone.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Category Manager Modal */}
        <Modal 
          show={showCategoryManagerModal} 
          onHide={() => setShowCategoryManagerModal(false)}
          dialogClassName="modal-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Manage Categories</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs defaultActiveKey="categories" className="mb-3">
              <Tab eventKey="categories" title="Categories">
                <div className="d-flex justify-content-end mb-3">
                  <Button 
                    variant="success" 
                    onClick={() => openCategoryModal('add')}
                  >
                    <i className="bi bi-plus-circle me-1"></i>Add New Category
                  </Button>
                </div>

                {sortedCategories.length > 0 ? (
                  <ListGroup>
                    {sortedCategories.map((category, index) => (
                      <ListGroup.Item key={category.id} className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="category-order-controls me-2">
                            <Button 
                              variant="outline-secondary"
                              size="sm"
                              className="p-0 px-1 me-1"
                              disabled={index === 0}
                              onClick={() => moveCategory(category.id, 'up')}
                            >
                              <i className="bi bi-arrow-up"></i>
                            </Button>
                            <Button 
                              variant="outline-secondary"
                              size="sm"
                              className="p-0 px-1"
                              disabled={index === categories.length - 1}
                              onClick={() => moveCategory(category.id, 'down')}
                            >
                              <i className="bi bi-arrow-down"></i>
                            </Button>
                          </div>
                          <span>{category.name}</span>
                        </div>
                        <div>
                          <Badge bg="info" className="me-2">
                            {category.subcategories.length} subcategories
                          </Badge>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-1"
                            onClick={() => openCategoryModal('edit', category)}
                          >
                            <i className="bi bi-pencil me-1"></i>Edit
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => openDeleteModal('category', category)}
                          >
                            <i className="bi bi-trash me-1"></i>Delete
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-center text-muted">No categories defined. Add your first category to get started.</p>
                )}
              </Tab>
              
              <Tab eventKey="subcategories" title="Subcategories">
                <Form.Group className="mb-3">
                  <Form.Label>Select Category</Form.Label>
                  <Form.Select 
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">Select a category</option>
                    {sortedCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {selectedCategory ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Subcategories for {getCategoryName(selectedCategory)}</h6>
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => openSubcategoryModal('add', selectedCategory)}
                      >
                        <i className="bi bi-plus-circle me-1"></i>Add Subcategory
                      </Button>
                    </div>

                    {getSortedSubcategories(selectedCategory).length > 0 ? (
                      <ListGroup>
                        {getSortedSubcategories(selectedCategory).map(subcat => (
                          <ListGroup.Item key={subcat.id} className="d-flex justify-content-between align-items-center">
                            <span>{subcat.name}</span>
                            <div>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-1"
                                onClick={() => openSubcategoryModal('edit', selectedCategory, subcat)}
                              >
                                <i className="bi bi-pencil me-1"></i>Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => openDeleteModal('subcategory', subcat)}
                              >
                                <i className="bi bi-trash me-1"></i>Delete
                              </Button>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p className="text-center text-muted">No subcategories found. Add your first subcategory using the button above.</p>
                    )}
                  </>
                ) : (
                  <p className="text-center text-muted">Please select a category to manage its subcategories.</p>
                )}
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCategoryManagerModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* Brand Modal */}
        <Modal show={showBrandModal} onHide={() => setShowBrandModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalAction === 'add' ? 'Add New Brand' : 'Edit Brand'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={brandForm.name}
                  onChange={handleBrandFormChange}
                  placeholder="Enter brand name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="type"
                  value={brandForm.type}
                  onChange={handleBrandFormChange}
                >
                  {brandTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  rows={3}
                  value={brandForm.notes}
                  onChange={handleBrandFormChange}
                  placeholder="Enter additional notes"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBrandModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveBrand}
              disabled={!brandForm.name.trim()}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* Brand Type Modal */}
        <Modal show={showBrandTypeModal} onHide={() => setShowBrandTypeModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalAction === 'add' ? 'Add New Type' : 'Edit Type'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Display Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="label"
                  value={brandTypeForm.label}
                  onChange={handleBrandTypeFormChange}
                  placeholder="Enter display name (e.g., Pharmacies)"
                  required
                />
                <Form.Text className="text-muted">
                  The type ID will be automatically generated from this name
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {modalAction === 'edit' && (
              <Button
                variant="danger"
                className="me-auto"
                onClick={() => handleDeleteBrandType(currentBrandType.id)}
              >
                Delete
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowBrandTypeModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveBrandType}
              disabled={!brandTypeForm.label.trim()}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* About Modal */}
        <Modal show={showAboutModal} onHide={() => setShowAboutModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>About</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <h4>BLA-tool by Juan v1.1</h4>
              <p>Created by Juan Manuel Ganancias</p>
              <p>with Cursor AI and Claude 3.7</p>
              <p>jmganancias@gmail.com</p>
              <p>2025</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAboutModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        
        <footer className="text-center mt-4 py-3 bg-light">
          <p>BLA-tool v1.1 by Juan Manuel Ganancias &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export default App
