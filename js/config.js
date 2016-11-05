EVONET.config = {
  MAX_OCTAVES: 4,                       // The number of octaves being run
                                        // through when the tile map is created
  GAME_HEIGHT: 24,                      // The height of the tile map
  GAME_WIDTH: 24,                       // The width of the tile map
  MIN_CREATURES: 5,                     // The minimum number of creatures alive
  GROWTH_RATE: .5,                      // The food value that is added to all
                                        // fertile tiles per tick
  MAX_FOOD_VALUE: 100,                  // The maximum food value a tile can
                                        // have.
  INIT_FOOD_VALUE: 40,                   // The food value all tiles are
                                        // initialized with.
  FOOD_VALUE_AFFECTS_NEIGHBORS: 60,     // Tiles with this food value make
                                        // neighboring tiles grow.
  FOOD_VALUE_IS_FERTILE: 50,            // Tiles with this food value can always
                                        // grow
  FPS: 1,                               // Frame rate
  ENERGY_AT_BIRTH: 100,                 // The energy a creature has when it's
                                        // spawned
  MIN_ENERGY: 50,                       // The minimum energy a creature can
                                        // have before it dies
  MIN_EDIBLE: 0,                        // The minimum food value a tile must
                                        // have so that a creature can eat
  MAX_EAT_VALUE: 20,                    // The maximum food value a creature can
                                        // eat per tick
  MUTATION_RATE: 1                      // Maximum change of weight
}

EVONET.constants = {
  IN_BIAS: Symbol(),
  IN_FOOD_VALUE_POSITION: Symbol(),
  IN_FOOD_VALUE_FEELER: Symbol(),
  IN_IS_CREATURE_ON_LAND: Symbol(),
  IN_IS_FEELER_ON_LAND: Symbol(),
  IN_ENERGY: Symbol(),
  IN_AGE: Symbol(),

  OUT_ROTATE: Symbol(),
  OUT_MOVE: Symbol(),
  OUT_EAT: Symbol(),
  OUT_BIRTH: Symbol()
}
