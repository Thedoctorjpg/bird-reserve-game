import React, { useState, useEffect, useMemo } from 'react';

// --- Constants & Species Data ---
// In the spirit of Nadia Lim's philosophy, these represent real, fresh ingredients for nature.
const PLANTS = [
  { id: 'bb', name: 'Buttonbush', color: '#4caf50', points: 10, type: 'native', attracts: 'Warbler' },
  { id: 'mw', name: 'Milkweed', color: '#8bc34a', points: 15, type: 'native', attracts: 'Monarch' },
  { id: 'ob', name: 'Oaks', color: '#2e7d32', points: 20, type: 'native', attracts: 'Bluebird' }
];

const BIRDS = {
  'Warbler': { 
    icon: '🐤', 
    song: 'tsee-tsee-tsee-tsitsi-tsée!', 
    fact: 'Warblers are insectivores. They love the caterpillars that thrive on native Buttonbush!',
    diet: 'Insects'
  },
  'Monarch': { 
    icon: '🦋', 
    song: '*Gentle wing fluttering*', 
    fact: 'Monarch caterpillars ONLY eat Milkweed. Without it, they cannot complete their life cycle.',
    diet: 'Milkweed Leaves'
  },
  'Bluebird': { 
    icon: '🐦', 
    song: 'tu-a-wee, tu-a-wee!', 
    fact: 'Eastern Bluebirds look for cavities in old Oak trees to build their nests.',
    diet: 'Insects & Berries'
  }
};

const INVASIVE_SPECIES = { id: 'weed', name: 'Invasive Weed', color: '#795548', points: 25, type: 'invasive' };
const CHECKLIST_ITEMS = ["Spot a Warbler", "Plant Native Species", "Remove Invasive Species", "Identify a Caterpillar"];

const App = () => {
  // --- State & Persistence ---
  // We use local storage to keep your reserve "staples" safe.
  const [grid, setGrid] = useState(() => {
    const saved = localStorage.getItem('birdReserveGrid');
    return saved ? JSON.parse(saved) : Array(25).fill(null);
  });
  
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('birdReserveScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('birdReserveChecklist');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedTool, setSelectedTool] = useState('plant');
  const [selectedPlant, setSelectedPlant] = useState(PLANTS[0]);
  const [activeBird, setActiveBird] = useState(null);

  // --- Biodiversity Star Rating ---
  const biodiversityRating = useMemo(() => {
    const activeSpecies = new Set(grid.filter(c => c?.type === 'native').map(c => c.id));
    const visitors = new Set(grid.filter(c => c?.hasVisitor).map(c => c.attracts));
    const weeds = grid.filter(c => c?.type === 'invasive').length;

    let stars = 0;
    if (activeSpecies.size >= 1) stars += 1; // Basic Habitat
    if (activeSpecies.size === 3) stars += 1; // Diverse Habitat
    if (visitors.size >= 1) stars += 1;      // Active Ecosystem
    if (visitors.size === 3) stars += 1;     // Thriving Biodiversity
    if (weeds === 0 && grid.some(c => c)) stars += 1; // Pristine Stewardship
    return stars;
  }, [grid]);

  const getRankName = (stars) => {
    const ranks = ["Empty Lot", "Budding Garden", "Local Patch", "Wildlife Haven", "Eco-Sanctuary", "Pristine Reserve"];
    return ranks[stars];
  };

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('birdReserveGrid', JSON.stringify(grid));
    localStorage.setItem('birdReserveScore', score.toString());
    localStorage.setItem('birdReserveChecklist', JSON.stringify(checklist));
  }, [grid, score, checklist]);

  useEffect(() => {
    const spawner = setInterval(() => {
      setGrid(currentGrid => {
        const newGrid = [...currentGrid];
        
        // Bird Spawning Logic
        const habitatIdx = newGrid.map((c, i) => (c?.type === 'native' && !c.hasVisitor) ? i : null).filter(v => v !== null);
        if (habitatIdx.length > 0 && Math.random() > 0.7) {
          const idx = habitatIdx[Math.floor(Math.random() * habitatIdx.length)];
          const plant = newGrid[idx];
          newGrid[idx] = { ...plant, hasVisitor: true, visitorIcon: BIRDS[plant.attracts].icon };
          if (plant.attracts === 'Warbler') setChecklist(p => ({ ...p, "Spot a Warbler": true }));
          setScore(s => s + 50);
        }

        // Weed Spawning Logic
        const emptyIdx = newGrid.map((v, i) => v === null ? i : null).filter(v => v !== null);
        if (emptyIdx.length > 0 && Math.random() > 0.4) {
          newGrid[emptyIdx[Math.floor(Math.random() * emptyIdx.length)]] = INVASIVE_SPECIES;
        }
        return newGrid;
      });
    }, 6000);
    return () => clearInterval(spawner);
  }, []);

  // --- Handlers ---
  const handleCellClick = (idx) => {
    const cell = grid[idx];
    
    // Priority: Open Field Guide if bird is present
    if (cell?.hasVisitor) {
      setActiveBird({ ...BIRDS[cell.attracts], name: cell.attracts });
      return;
    }

    const newGrid = [...grid];
    if (selectedTool === 'weed' && cell?.type === 'invasive') {
      newGrid[idx] = null;
      setGrid(newGrid);
      setScore(s => s + 30);
      setChecklist(p => ({ ...p, "Remove Invasive Species": true }));
    } else if (selectedTool === 'plant' && !cell) {
      newGrid[idx] = { ...selectedPlant, hasVisitor: false };
      setGrid(newGrid);
      setScore(s => s + selectedPlant.points);
      setChecklist(p