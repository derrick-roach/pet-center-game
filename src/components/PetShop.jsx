import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Coffee, Moon, Coins, Droplet } from 'lucide-react';
import './PetShop.css';

const PET_TYPES = [
  { emoji: '🐱', name: 'Kitten' },
  { emoji: '🐶', name: 'Puppy' },
  { emoji: '🐰', name: 'Bunny' },
  { emoji: '🐥', name: 'Chick' },
  { emoji: '🐹', name: 'Hamster' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🐍', name: 'Snake' },
  { emoji: '🦎', name: 'Lizard' },
  { emoji: '🐯', name: 'Tiger' },
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐻', name: 'Bear' },
  { emoji: '🦄', name: 'Unicorn' },
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🐸', name: 'Frog' },
  { emoji: '🐢', name: 'Turtle' },
  { emoji: '🦖', name: 'T-Rex' },
  { emoji: '🦕', name: 'Brontosaurus' },
  { emoji: '🦥', name: 'Sloth' },
  { emoji: '🦦', name: 'Otter' },
  { emoji: '🦔', name: 'Hedgehog' },
];

const NAMES = ["Bella", "Max", "Luna", "Charlie", "Lucy", "Cooper", "Daisy", "Milo", "Zoe", "Rocky", "Leo", "Nala", "Coco", "Oliver", "Chloe", "Teddy", "Molly", "Buster", "Ruby", "Oscar"];

const generateInitialPets = (count = 3) => {
  const initial = [];
  const usedNames = new Set();
  for (let i = 0; i < count; i++) {
    const type = PET_TYPES[Math.floor(Math.random() * PET_TYPES.length)];
    const availableNames = NAMES.filter(n => !usedNames.has(n));
    const name = availableNames[Math.floor(Math.random() * availableNames.length)];
    usedNames.add(name);

    initial.push({
      id: i + 1,
      type,
      name,
      hunger: 60 + Math.floor(Math.random() * 41), // 60-100
      happiness: 60 + Math.floor(Math.random() * 41),
      energy: 60 + Math.floor(Math.random() * 41),
      cleanliness: 60 + Math.floor(Math.random() * 41),
      daysRemaining: Math.floor(Math.random() * 15) + 1,
      isSleeping: false
    });
  }
  return initial;
};

export default function PetShop() {
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'gameover'
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [startingPetsCount, setStartingPetsCount] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);

  const [pets, setPets] = useState([]);
  const [coins, setCoins] = useState(60);
  const [selectedPetId, setSelectedPetId] = useState(null);

  const petsRef = useRef(pets);
  useEffect(() => {
    petsRef.current = pets;
  }, [pets]);

  const startGame = () => {
    setPets(generateInitialPets(startingPetsCount));
    setCoins(60);
    setTimeLeft(timerMinutes * 60);
    setGameState('playing');
    setSelectedPetId(null);
  };

  // Game loop to decay stats
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      const currentPets = petsRef.current;
      let coinsToAward = 0;
      
      const updatedPets = currentPets.map(pet => {
        if (pet.isSleeping) {
          // If sleeping, regain energy, hunger drops slowly
          const newEnergy = Math.min(100, pet.energy + 10);
          const isDoneSleeping = newEnergy === 100;
          return {
            ...pet,
            energy: newEnergy,
            hunger: Math.max(0, pet.hunger - 2),
            cleanliness: Math.max(0, pet.cleanliness - 1),
            isSleeping: !isDoneSleeping
          };
        } else {
          // Normal decay
          const newEnergy = Math.max(0, pet.energy - 4);
          const willSleep = newEnergy <= 10;
          if (willSleep) {
            coinsToAward += 30;
          }
          return {
            ...pet,
            hunger: Math.max(0, pet.hunger - 5),
            happiness: Math.max(0, pet.happiness - 3),
            energy: newEnergy,
            cleanliness: Math.max(0, pet.cleanliness - 2),
            isSleeping: willSleep,
            daysRemaining: willSleep ? pet.daysRemaining - 1 : pet.daysRemaining
          };
        }
      });

      const finalPets = updatedPets.filter(p => p.daysRemaining > 0);
      setPets(finalPets);

      if (coinsToAward > 0) {
        setCoins(c => c + coinsToAward);
      }
    }, 5000); // Stats change every 5 seconds for low pressure
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const interactWithPet = (id, action) => {
    let coinsEarned = 0;

    const updatedPets = pets.map(pet => {
      if (pet.id !== id) return pet;

      let newPet = { ...pet };

      if (action === 'feed' && !pet.isSleeping) {
        if (pet.hunger < 100 && coins >= 1) {
          newPet.hunger = Math.min(100, pet.hunger + 30);
          coinsEarned = -1;
        }
      } else if (action === 'play' && !pet.isSleeping) {
        if (pet.energy > 10 && pet.happiness < 100 && coins >= 2) {
          newPet.happiness = Math.min(100, pet.happiness + 20);
          newPet.energy = Math.max(0, pet.energy - 15);
          newPet.cleanliness = Math.max(0, pet.cleanliness - 10);
          coinsEarned = -2;
        }
      } else if (action === 'bathe' && !pet.isSleeping) {
        if (pet.cleanliness < 100 && coins >= 3) {
          newPet.cleanliness = 100;
          coinsEarned = -3;
        }
      }

      return newPet;
    });

    if (coinsEarned !== 0) {
      setPets(updatedPets);
      setCoins(c => c + coinsEarned);
    }
  };

  const adoptNewPet = () => {
    setCoins(c => c + 20);
    const randomType = PET_TYPES[Math.floor(Math.random() * PET_TYPES.length)];

    const usedNames = pets.map(p => p.name);
    let availableNames = NAMES.filter(n => !usedNames.includes(n));
    if (availableNames.length === 0) {
      availableNames = NAMES.map(n => n + ' II');
    }
    const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];

    const newPet = {
      id: Date.now(),
      type: randomType,
      name: randomName,
      hunger: 100,
      happiness: 100,
      energy: 100,
      cleanliness: 100,
      daysRemaining: Math.floor(Math.random() * 15) + 1,
      isSleeping: false
    };
    setPets([...pets, newPet]);
  };

  if (gameState === 'setup') {
    return (
      <div className="pet-shop-container">
        <header className="shop-header" style={{ justifyContent: 'center' }}>
          <h1>🐾 Iris & Dahlia's Pet Center 🐾</h1>
        </header>
        <div className="setup-container">
          <h2>Game Setup</h2>
          
          <div className="setup-group">
            <label>Countdown Timer: {timerMinutes} {timerMinutes === 1 ? 'Minute' : 'Minutes'}</label>
            <input 
              type="range" 
              min="1" max="15" 
              value={timerMinutes} 
              onChange={e => setTimerMinutes(parseInt(e.target.value))} 
            />
            <div className="slider-labels">
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
            </div>
          </div>

          <div className="setup-group">
            <label>Starting Pets: {startingPetsCount}</label>
            <input 
              type="range" 
              min="1" max="5" 
              value={startingPetsCount} 
              onChange={e => setStartingPetsCount(parseInt(e.target.value))} 
            />
            <div className="slider-labels">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          <button className="start-btn" onClick={startGame}>Start Game</button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="pet-shop-container">
        <header className="shop-header" style={{ justifyContent: 'center' }}>
          <h1>🐾 Iris & Dahlia's Pet Center 🐾</h1>
        </header>
        <div className="setup-container">
          <h2>Time's Up!</h2>
          <div className="final-score">
            <Coins size={64} color="#fbbf24" />
            <p>You earned a total of</p>
            <h3>{coins} Coins!</h3>
          </div>
          <button className="start-btn" onClick={() => setGameState('setup')}>Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pet-shop-container">
      <header className="shop-header">
        <h1>🐾 Iris & Dahlia's Pet Center 🐾</h1>
        <div className="header-stats">
          <div className="time-display">
            ⏰ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="coin-display">
            <Coins size={28} color="#fbbf24" />
            <span>{coins} Coins</span>
          </div>
        </div>
      </header>

      <div className="actions-bar">
        <button
          className="adopt-btn can-adopt"
          onClick={adoptNewPet}
        >
          Accept New Pet (+20 Coins Deposit)
        </button>
      </div>

      <div className="pets-grid">
        <AnimatePresence>
          {pets.map(pet => (
            <motion.div
              key={pet.id}
              className={`pet-card ${pet.isSleeping ? 'sleeping' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedPetId(selectedPetId === pet.id ? null : pet.id)}
            >
              <div className="pet-emoji">
                {pet.type.emoji}
                {pet.isSleeping && <span className="zzz">Zzz</span>}
              </div>
              <h2 className="pet-name">{pet.name}</h2>
              <div className="days-remaining">⏳ {pet.daysRemaining} days left</div>

              <div className="stats">
                <StatBar icon={<Heart size={16} />} value={pet.hunger} color="#ef4444" label="Food" />
                <StatBar icon={<Star size={16} />} value={pet.happiness} color="#eab308" label="Happy" />
                <StatBar icon={<Droplet size={16} />} value={pet.cleanliness} color="#0ea5e9" label="Clean" />
                <StatBar icon={<Coffee size={16} />} value={pet.energy} color="#3b82f6" label="Energy" />
              </div>

              <AnimatePresence>
                {selectedPetId === pet.id && (
                  <motion.div
                    className="interaction-menu"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); interactWithPet(pet.id, 'feed'); }}
                      disabled={pet.isSleeping || pet.hunger >= 100 || coins < 1}
                    >
                      🍼 Feed (-1)
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); interactWithPet(pet.id, 'play'); }}
                      disabled={pet.isSleeping || pet.energy <= 10 || pet.happiness >= 100 || coins < 2}
                    >
                      🎾 Play (-2)
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); interactWithPet(pet.id, 'bathe'); }}
                      disabled={pet.isSleeping || pet.cleanliness >= 100 || coins < 3}
                    >
                      🛁 Clean (-3)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatBar({ icon, value, color, label }) {
  return (
    <div className="stat-row">
      <div className="stat-icon" style={{ color }}>{icon}</div>
      <div className="stat-bar-bg">
        <motion.div
          className="stat-bar-fill"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
