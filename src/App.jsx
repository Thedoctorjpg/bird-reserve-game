import { useState, useEffect, useRef } from 'react';

// Your images (keep as-is)
import warblerImg from './images/Warbler.jpg';
import monarchCaterpillarImg from './images/monarch_caterpillar.jpg';
import buttonbushImg from './images/buttonbush.jpeg';
import goldfinchNestImg from './images/Goldfinch-Nest.jpg';
import easternBluebirdImg from './images/male-eastern-bluebird.webp';
import migratingBirdsImg from './images/migrating_birds.jpeg';
import flywaysMapImg from './images/migratory-flyways-map-north-america.webp';

// ... (keep PLANTS, INVASIVES, PREDATORS, CHECKLIST_ITEMS from previous)

function App() {
  const [grid, setGrid] = useState(Array(25).fill(null));
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [score, setScore] = useState(0);
  const [predators, setPredators] = useState([]);
  const [invasives, setInvasives] = useState([]);
  const [nextMigration, setNextMigration] = useState(45);
  const [isMigration, setIsMigration] = useState(false);
  const [checklist, setChecklist] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [showEbirdMock, setShowEbirdMock] = useState(false); // New: mock submit modal

  // ... (keep audio refs/play functions, handleCellClick with checklist updates, effects for predators/invasives/migration/bonus)

  // Trigger mock submit when checklist full or score milestone (e.g., 500+)
  useEffect(() => {
    const completed = Object.values(checklist).filter(Boolean).length;
    if ((completed === CHECKLIST_ITEMS.length || score >= 500) && !showEbirdMock && !showReport) {
      setScore(s => s + 100); // Bonus for "submitting" data!
      setShowEbirdMock(true);
    }
  }, [checklist, score, showEbirdMock, showReport]);

  const handleMockSubmit = () => {
    // Fake "submission" – could add confetti lib later if wanted
    alert("Mock eBird Submission Successful! Your reserve observations 'sent' – in real life, head to ebird.org/submit to log actual sightings!");
    setShowEbirdMock(false);
  };

  // ... (rest of component logic)

  return (
    <div className={`game-container ${isMigration ? 'migration' : ''}`}>
      {/* ... your existing h1, score p, migration countdown, migration overlay, flying flock, grid, plants buttons, gallery */}

      {/* Citizen Science Checklist (from before) */}
      <div className="checklist-section" style={{ margin: '30px 0', padding: '20px', background: '#e8f5e9', borderRadius: '16px', border: '2px solid #4caf50' }}>
        <h2>Audubon Field Notebook – Citizen Science Time!</h2>
        <p>Channel your inner ranger: Spot & check off like the PDF adventure! Progress: {Object.values(checklist).filter(Boolean).length}/{CHECKLIST_ITEMS.length}</p>
        {/* ... checklist grid with checkboxes */}
        {showReport && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#fff176', borderRadius: '12px' }}>
            <h3>Field Notes Complete! 🎉</h3>
            <p>Awesome logging – real Audubon citizen scientists do this daily! Now "submit" your mock eBird checklist below to rack up bonus points. In real life: Log sightings at ebird.org or plant natives via audubon.org/native-plants (zip code finder for your Auckland spot!).</p>
            <button onClick={() => setShowReport(false)}>Close</button>
          </div>
        )}
      </div>

      {/* Mock eBird Submit Modal */}
      {showEbirdMock && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '16px', maxWidth: '600px',
            width: '90%', boxShadow: '0 10px 40px rgba(0,0,0,0.4)', textAlign: 'left'
          }}>
            <h2>Mock eBird Checklist Submission</h2>
            <p><strong>Location:</strong> Auckland Reserve (your backyard sim!)</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Effort:</strong> {Math.floor(score / 10)} min stationary count</p>
            <p><strong>Protocol:</strong> Stationary (like PDF adventure – no travel!)</p>
            <p><strong>Observations:</strong></p>
            <ul>
              <li>Native Plants: {grid.filter(Boolean).length} (e.g., {grid.filter(Boolean).map(p => p?.name).join(', ') || 'none yet'})</li>
              <li>Birds Attracted: {score} (migration flocks spotted!)</li>
              <li>Invasives Removed: {invasives.length} (Purple Loosestrife yanked!)</li>
              <li>Checklist Complete: Yes – full field notes!</li>
            </ul>
            <p>Real eBird Tip: Submit complete checklists with effort (time/distance) at <a href="https://ebird.org/submit" target="_blank" rel="noopener noreferrer">ebird.org/submit</a>. Add photos/notes for rare sightings!</p>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button onClick={handleMockSubmit} style={{ padding: '12px 30px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer' }}>
                Submit Mock Checklist!
              </button>
              <button onClick={() => setShowEbirdMock(false)} style={{ marginLeft: '15px', padding: '12px 20px', background: '#757575', color: 'white', border: 'none', borderRadius: '8px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer callout */}
