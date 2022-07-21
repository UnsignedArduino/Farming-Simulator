namespace SpriteKind {
    export const House = SpriteKind.create()
    export const Decoration = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_inventory) {
        move_up_in_inventory_toolbar()
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    handle_b_key_in_inventory_toolbar()
})
function remove_item_from_toolbar (index: number) {
    item = toolbar.get_items()[index]
    if (!(item)) {
        return [][0]
    }
    if (item.get_text(ItemTextAttribute.Tooltip) == "") {
        if (toolbar.get_items().removeAt(index)) {
        	
        }
    } else if (item.get_text(ItemTextAttribute.Tooltip) == "2") {
        item.set_text(ItemTextAttribute.Tooltip, "")
    } else {
        item.set_text(ItemTextAttribute.Tooltip, convertToText(parseFloat(item.get_text(ItemTextAttribute.Tooltip)) - 1))
    }
    toolbar.update()
    return Inventory.create_item(item.get_text(ItemTextAttribute.Name), item.get_image())
}
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_inventory) {
        move_up_in_inventory_toolbar()
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_inventory) {
        handle_a_key_in_inventory_toolbar()
    } else {
    	
    }
})
function animate_sprite (sprite: Sprite, _static: Image, static_condition: number, animation2: any[], animation_condition: number) {
    characterAnimations.loopFrames(
    sprite,
    animation2,
    100,
    animation_condition
    )
    characterAnimations.runFrames(
    sprite,
    [_static],
    0,
    static_condition
    )
}
controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_inventory) {
        move_right_in_inventory_toolbar()
    }
})
function load_environment_outside () {
    scene.setBackgroundColor(7)
    tiles.setCurrentTilemap(tilemap`outside`)
    scene.cameraFollowSprite(the_player)
    the_house = sprites.create(assets.image`house`, SpriteKind.House)
    tiles.placeOnTile(the_house, tiles.getTilesByType(assets.tile`house`)[0])
    the_house.y += -16
    the_house.z = the_house.bottom / 100
    tiles.placeOnTile(the_player, tiles.getTilesByType(assets.tile`house`)[0].getNeighboringLocation(CollisionDirection.Bottom))
    tiles.setTileAt(tiles.getTilesByType(assets.tile`house`)[0], assets.tile`grass`)
    rng_ground = Random.createRNG(2)
    for (let index = 0; index < 50; index++) {
        tiles.setTileAt(rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`)), sprites.castle.tileGrass1)
    }
    for (let index = 0; index < 40; index++) {
        tiles.setTileAt(rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`)), sprites.castle.tileGrass3)
    }
    for (let index = 0; index < 30; index++) {
        tiles.setTileAt(rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`)), sprites.castle.tileGrass2)
    }
    for (let index = 0; index < 20; index++) {
        place_decoration(assets.image`flower_1`, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 2 / 16, true)
    }
    for (let index = 0; index < 20; index++) {
        place_decoration(assets.image`flower_2`, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 2 / 16, true)
    }
    for (let index = 0; index < 5; index++) {
        place_decoration(sprites.castle.rock0, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 0, false)
    }
    for (let index = 0; index < 5; index++) {
        place_decoration(sprites.castle.rock1, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 0, false)
    }
    for (let index = 0; index < 5; index++) {
        place_decoration(sprites.castle.rock1, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 0, false)
    }
    for (let index = 0; index < 5; index++) {
        place_decoration(assets.tile`stump`, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 0, false)
    }
    for (let index = 0; index < 10; index++) {
        place_decoration(assets.image`flower_3`, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 3 / 16, true)
    }
    for (let index = 0; index < 10; index++) {
        place_decoration(assets.image`flower_4`, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 3 / 16, true)
    }
    for (let index = 0; index < 5; index++) {
        place_decoration(assets.image`flower_5`, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 3 / 16, true)
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_inventory) {
        move_left_in_inventory_toolbar()
    }
})
function give_starting_items () {
    inventory.get_items().push(Inventory.create_item("Pickaxe", assets.image`pickaxe_1`))
    inventory.get_items().push(Inventory.create_item("Axe", assets.image`axe`))
    inventory.get_items().push(Inventory.create_item("Shovel", assets.image`shovel`))
    inventory.get_items().push(Inventory.create_item("Hoe", assets.image`hoe`))
}
function place_decoration (image2: Image, location_in_list: any[], shift_tiles_up: number, can_go_through: boolean) {
    if (can_go_through) {
        the_decoration = sprites.create(image2, SpriteKind.Decoration)
        tiles.placeOnTile(the_decoration, location_in_list[0])
        the_decoration.y += shift_tiles_up * -16
        the_decoration.z = the_decoration.bottom / 100
        the_decoration.setFlag(SpriteFlag.Ghost, true)
    } else {
        tiles.setTileAt(location_in_list[0], image2)
        tiles.setWallAt(location_in_list[0], true)
    }
}
function move_down_in_inventory_toolbar () {
    if (cursor_in_inventory) {
        if (inventory.get_number(InventoryNumberAttribute.SelectedIndex) < inventory.get_items().length - 8) {
            inventory.change_number(InventoryNumberAttribute.SelectedIndex, 8)
        }
    } else {
        toolbar.set_number(ToolbarNumberAttribute.SelectedIndex, toolbar.get_number(ToolbarNumberAttribute.MaxItems) - 1)
    }
}
function enable_movement (en: boolean) {
    if (en) {
        controller.moveSprite(the_player, 80, 80)
    } else {
        controller.moveSprite(the_player, 0, 0)
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_inventory) {
        move_right_in_inventory_toolbar()
    }
})
function handle_a_key_in_inventory_toolbar () {
    if (cursor_in_inventory) {
        if (toolbar.get_items().length < toolbar.get_number(ToolbarNumberAttribute.MaxItems)) {
            toolbar.get_items().push(inventory.get_items().removeAt(inventory.get_number(InventoryNumberAttribute.SelectedIndex)))
            handle_b_key_in_inventory_toolbar()
            toolbar.set_number(ToolbarNumberAttribute.SelectedIndex, toolbar.get_items().length - 1)
        }
    } else {
        if (inventory.get_items().length < inventory.get_number(InventoryNumberAttribute.MaxItems) && toolbar.get_number(ToolbarNumberAttribute.SelectedIndex) < toolbar.get_items().length) {
            inventory.get_items().push(toolbar.get_items().removeAt(toolbar.get_number(ToolbarNumberAttribute.SelectedIndex)))
            handle_b_key_in_inventory_toolbar()
            inventory.set_number(InventoryNumberAttribute.SelectedIndex, inventory.get_items().length - 1)
        }
    }
    toolbar.update()
    inventory.update()
}
function make_player () {
    the_player = sprites.create(assets.image`player_facing_forward`, SpriteKind.Player)
    the_player.z = 10
    enable_movement(true)
    animate_sprite(the_player, assets.animation`player_walk_upwards`[1], characterAnimations.rule(Predicate.FacingUp, Predicate.NotMoving), assets.animation`player_walk_upwards`, characterAnimations.rule(Predicate.MovingUp))
    animate_sprite(the_player, assets.animation`player_walk_right`[1], characterAnimations.rule(Predicate.FacingRight, Predicate.NotMoving), assets.animation`player_walk_right`, characterAnimations.rule(Predicate.MovingRight))
    animate_sprite(the_player, assets.animation`player_walk_down`[1], characterAnimations.rule(Predicate.FacingDown, Predicate.NotMoving), assets.animation`player_walk_down`, characterAnimations.rule(Predicate.MovingDown))
    animate_sprite(the_player, assets.animation`player_walk_left`[1], characterAnimations.rule(Predicate.FacingLeft, Predicate.NotMoving), assets.animation`player_walk_left`, characterAnimations.rule(Predicate.MovingLeft))
}
controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_inventory) {
        move_down_in_inventory_toolbar()
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_inventory) {
        move_down_in_inventory_toolbar()
    }
})
function move_left_in_inventory_toolbar () {
    if (cursor_in_inventory) {
        if (inventory.get_number(InventoryNumberAttribute.SelectedIndex) % 8 > 0) {
            inventory.change_number(InventoryNumberAttribute.SelectedIndex, -1)
        }
    } else {
        if (toolbar.get_number(ToolbarNumberAttribute.SelectedIndex) > 0) {
            toolbar.change_number(ToolbarNumberAttribute.SelectedIndex, -1)
        }
    }
}
function move_right_in_inventory_toolbar () {
    if (cursor_in_inventory) {
        if (inventory.get_number(InventoryNumberAttribute.SelectedIndex) % 8 < 7 && inventory.get_number(InventoryNumberAttribute.SelectedIndex) < inventory.get_items().length - 1) {
            inventory.change_number(InventoryNumberAttribute.SelectedIndex, 1)
        }
    } else {
        if (toolbar.get_number(ToolbarNumberAttribute.SelectedIndex) < toolbar.get_number(ToolbarNumberAttribute.MaxItems) - 1) {
            toolbar.change_number(ToolbarNumberAttribute.SelectedIndex, 1)
        }
    }
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    handle_menu_key_in_inventory_toolbar()
})
function handle_menu_key_in_inventory_toolbar () {
    in_inventory = !(in_inventory)
    inventory.setFlag(SpriteFlag.Invisible, !(in_inventory))
    enable_movement(!(in_inventory))
    cursor_in_inventory = false
    if (in_inventory) {
        inventory.set_number(InventoryNumberAttribute.SelectedIndex, -1)
        last_toolbar_select = toolbar.get_number(ToolbarNumberAttribute.SelectedIndex)
    } else {
        toolbar.set_number(ToolbarNumberAttribute.SelectedIndex, last_toolbar_select)
        if (inventory.get_number(InventoryNumberAttribute.SelectedIndex) != -1) {
            last_inventory_select = inventory.get_number(InventoryNumberAttribute.SelectedIndex)
        }
    }
}
function move_up_in_inventory_toolbar () {
    if (cursor_in_inventory) {
        if (inventory.get_number(InventoryNumberAttribute.SelectedIndex) > 7) {
            inventory.change_number(InventoryNumberAttribute.SelectedIndex, -8)
        }
    } else {
        toolbar.set_number(ToolbarNumberAttribute.SelectedIndex, 0)
    }
}
function make_toolbar () {
    toolbar = Inventory.create_toolbar([], 3)
    toolbar.setFlag(SpriteFlag.RelativeToCamera, true)
    toolbar.left = 4
    toolbar.bottom = scene.screenHeight() - 4
    toolbar.z = 50
}
function make_inventory_toolbar () {
    in_inventory = false
    cursor_in_inventory = false
    last_toolbar_select = 0
    last_inventory_select = 0
    make_toolbar()
    make_inventory()
}
function add_item (item_in_list: any[]) {
    for (let item of toolbar.get_items()) {
        if (item.get_image().equals(item_in_list[0].get_image())) {
            if (item.get_text(ItemTextAttribute.Tooltip) == "") {
                item.set_text(ItemTextAttribute.Tooltip, "2")
            } else {
                item.set_text(ItemTextAttribute.Tooltip, convertToText(parseFloat(item.get_text(ItemTextAttribute.Tooltip)) + 1))
            }
            toolbar.update()
            return true
        }
    }
    for (let item of inventory.get_items()) {
        if (item.get_image().equals(item_in_list[0].get_image())) {
            if (item.get_text(ItemTextAttribute.Tooltip) == "") {
                item.set_text(ItemTextAttribute.Tooltip, "2")
            } else {
                item.set_text(ItemTextAttribute.Tooltip, convertToText(parseFloat(item.get_text(ItemTextAttribute.Tooltip)) + 1))
            }
            inventory.update()
            return true
        }
    }
    if (toolbar.get_items().length < toolbar.get_number(ToolbarNumberAttribute.MaxItems)) {
        toolbar.get_items().push(item_in_list[0])
        item_in_list[0].set_text(ItemTextAttribute.Tooltip, "")
        toolbar.update()
        return true
    }
    if (inventory.get_items().length < inventory.get_number(InventoryNumberAttribute.MaxItems)) {
        inventory.get_items().push(item_in_list[0])
        item_in_list[0].set_text(ItemTextAttribute.Tooltip, "")
        inventory.update()
        return true
    }
    return false
}
function handle_b_key_in_inventory_toolbar () {
    if (in_inventory) {
        cursor_in_inventory = !(cursor_in_inventory)
        if (inventory.get_items().length == 0) {
            cursor_in_inventory = false
        }
        if (cursor_in_inventory) {
            if (last_inventory_select == -1) {
                last_inventory_select = 0
            }
            inventory.set_number(InventoryNumberAttribute.SelectedIndex, Math.constrain(last_inventory_select, 0, inventory.get_items().length - 1))
            last_toolbar_select = toolbar.get_number(ToolbarNumberAttribute.SelectedIndex)
            toolbar.set_number(ToolbarNumberAttribute.SelectedIndex, -1)
        } else {
            if (last_toolbar_select == -1) {
                last_toolbar_select = 0
            }
            toolbar.set_number(ToolbarNumberAttribute.SelectedIndex, last_toolbar_select)
            last_inventory_select = inventory.get_number(InventoryNumberAttribute.SelectedIndex)
            inventory.set_number(InventoryNumberAttribute.SelectedIndex, -1)
        }
    } else {
        toolbar.change_number(ToolbarNumberAttribute.SelectedIndex, 1)
        if (toolbar.get_number(ToolbarNumberAttribute.SelectedIndex) == toolbar.get_number(ToolbarNumberAttribute.MaxItems)) {
            toolbar.set_number(ToolbarNumberAttribute.SelectedIndex, 0)
        }
    }
}
function make_inventory () {
    inventory = Inventory.create_inventory([], 32)
    inventory.setFlag(SpriteFlag.RelativeToCamera, true)
    inventory.setFlag(SpriteFlag.Invisible, true)
    inventory.left = 4
    inventory.top = 4
    inventory.z = 50
}
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_inventory) {
        move_left_in_inventory_toolbar()
    }
})
let last_inventory_select = 0
let last_toolbar_select = 0
let cursor_in_inventory = false
let the_decoration: Sprite = null
let inventory: Inventory.Inventory = null
let rng_ground: FastRandomBlocks = null
let the_house: Sprite = null
let the_player: Sprite = null
let toolbar: Inventory.Toolbar = null
let item: Inventory.Item = null
let in_inventory = false
stats.turnStats(true)
make_player()
load_environment_outside()
make_inventory_toolbar()
controller.configureRepeatEventDefaults(333, 50)
give_starting_items()
game.onUpdate(function () {
    the_player.z = the_player.bottom / 100
})
