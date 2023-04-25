import Phaser from 'phaser'

const animations = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: "player-walk",
        frames: [
            { key: "deliveryboy" },
            { key: "deliveryboy_walk", duration: 50 }
        ],
        frameRate: 8
    });
    anims.create({
        key: "player_hurt",
        frames: [
            { key: "deliveryboy" },
            { key: "deliveryboy_hurt", duration: 50 },
            { key: "deliveryboy" }
        ]
    });
    anims.create({
        key: "player",
        frames: [
            { key: "deliveryboy" },
        ]
    });
    anims.create({
        key: "granny_walk",
        frames: [
          {key: "granny"},
          {key: "granny_walk", duration: 50}
        ],
        frameRate: 6,
        repeat: -1
    });
    anims.create({
        key: "hunter_hurt",
        frames: [
            { key: "hunter" },
            { key: "hunter_hurt", duration: 50 },
            { key: "hunter" },
        ],
    });
    anims.create({
        key: "hunter_shoot",
        frames: [
          { key: "hunter_shoot"}
        ],
        repeat: -1
    });
    anims.create({
        key: "ninja_walk",
        frames: [
            { key: "ninja"},
          { key: "ninja_walk", duration: 50}
        ],
        frameRate: 7,
        repeat: -1
    });
    anims.create({
        key: "chest_open",
        frames: [
          {key: "chest_opened", duration: 50}
        ],
        frameRate: 1,
        repeat: 1
    });
}

export {
    animations
}