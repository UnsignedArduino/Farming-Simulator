namespace SpriteKind {
    export const House = SpriteKind.create()
    export const Decoration = SpriteKind.create()
    export const TileCursor = SpriteKind.create()
}
function do_action () {
    if (tile_at_loc_is_one_off([the_cursor.tilemapLocation()], [
    assets.tile`grass`,
    sprites.castle.tileGrass1,
    sprites.castle.tileGrass3,
    sprites.castle.tileGrass2
    ]) && is_name_of_selected_item("Shovel")) {
        tiles.setTileAt(the_cursor.tilemapLocation(), sprites.castle.tilePath5)
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`stump`) && is_name_of_selected_item("Axe")) {
        tiles.setTileAt(the_cursor.tilemapLocation(), sprites.castle.tilePath5)
        tiles.setWallAt(the_cursor.tilemapLocation(), false)
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`wet_dirt`) && is_name_of_selected_item("Hoe")) {
        tiles.setTileAt(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`)
    } else if (tile_at_loc_is_one_off([the_cursor.tilemapLocation()], [sprites.castle.rock0, sprites.castle.rock1]) && is_name_of_selected_item("Pickaxe")) {
        tiles.setTileAt(the_cursor.tilemapLocation(), sprites.castle.tilePath5)
        tiles.setWallAt(the_cursor.tilemapLocation(), false)
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`water`) && is_name_of_selected_item("Watering can") && get_watering_can_fill() < 100) {
        change_watering_can_fill(1)
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), sprites.castle.tilePath5) && is_name_of_selected_item("Watering can") && get_watering_can_fill() >= 10) {
        tiles.setTileAt(the_cursor.tilemapLocation(), assets.tile`wet_dirt`)
        change_watering_can_fill(-10)
    }
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_inventory) {
        move_up_in_inventory_toolbar()
    }
})
function update_tile_cursor_and_action_label () {
    if (characterAnimations.matchesRule(the_player, characterAnimations.rule(Predicate.FacingUp))) {
        tiles.placeOnTile(the_cursor, the_player.tilemapLocation().getNeighboringLocation(CollisionDirection.Top))
    } else if (characterAnimations.matchesRule(the_player, characterAnimations.rule(Predicate.FacingRight))) {
        tiles.placeOnTile(the_cursor, the_player.tilemapLocation().getNeighboringLocation(CollisionDirection.Right))
    } else if (characterAnimations.matchesRule(the_player, characterAnimations.rule(Predicate.FacingDown))) {
        tiles.placeOnTile(the_cursor, the_player.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom))
    } else {
        tiles.placeOnTile(the_cursor, the_player.tilemapLocation().getNeighboringLocation(CollisionDirection.Left))
    }
    the_cursor.setFlag(SpriteFlag.Invisible, !(have_something_selected_in_toolbar()))
    can_use = update_action_label()
    if (can_last_use != can_use) {
        can_last_use = can_use
        if (can_use) {
            animation.runImageAnimation(
            the_cursor,
            assets.animation`tile_cursor_animation_can_do`,
            500,
            true
            )
        } else {
            animation.runImageAnimation(
            the_cursor,
            assets.animation`tile_cursor_animation`,
            500,
            true
            )
        }
    }
}
function is_name_of_selected_item (name: string) {
    if (have_something_selected_in_toolbar()) {
        return toolbar.get_items()[toolbar.get_number(ToolbarNumberAttribute.SelectedIndex)].get_text(ItemTextAttribute.Name) == name
    } else {
        return false
    }
}
function make_time_label () {
    time_label = textsprite.create("8:00", 1, 15)
    time_label.setBorder(1, 15, 1)
    time_label.setFlag(SpriteFlag.RelativeToCamera, true)
    time_label.z = 20
    time_label.top = 4
    last_time = game.runtime()
    secs_left_in_day = 86400 - 8 * 3600
    secs_elapsed_today = 0
    update_time()
    on_day_start()
}
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
function make_tile_cursor_and_action_label () {
    the_cursor = sprites.create(assets.image`tile_cursor`, SpriteKind.TileCursor)
    the_cursor.setFlag(SpriteFlag.Ghost, true)
    the_cursor.z = 20
    action_label = textsprite.create("", 0, 15)
    action_label.setFlag(SpriteFlag.RelativeToCamera, true)
    action_label.bottom = scene.screenHeight() - 4
    action_label.z = 20
    can_last_use = true
    update_tile_cursor_and_action_label()
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
        do_action()
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
    item = Inventory.create_item("Watering can", assets.image`watering_can`)
    item.set_text(ItemTextAttribute.Tooltip, "0%")
    inventory.get_items().push(item)
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
function update_action_label () {
    if (tile_at_loc_is_one_off([the_cursor.tilemapLocation()], [
    assets.tile`grass`,
    sprites.castle.tileGrass1,
    sprites.castle.tileGrass3,
    sprites.castle.tileGrass2
    ]) && is_name_of_selected_item("Shovel")) {
        label = "Remove grass"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`stump`) && is_name_of_selected_item("Axe")) {
        label = "Remove stump"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`wet_dirt`) && is_name_of_selected_item("Hoe")) {
        label = "Till dirt"
    } else if (tile_at_loc_is_one_off([the_cursor.tilemapLocation()], [sprites.castle.rock0, sprites.castle.rock1]) && is_name_of_selected_item("Pickaxe")) {
        label = "Remove rock"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`water`) && is_name_of_selected_item("Watering can") && get_watering_can_fill() < 100) {
        label = "Fill watering can"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), sprites.castle.tilePath5) && is_name_of_selected_item("Watering can") && get_watering_can_fill() >= 10) {
        label = "Water dirt"
    } else {
        label = ""
    }
    action_label.setText(label)
    action_label.right = scene.screenWidth() - 4
    return label != ""
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_inventory) {
        move_right_in_inventory_toolbar()
    }
})
function tile_at_loc_is_one_off (loc_in_list: any[], tiles2: any[]) {
    for (let tile of tiles2) {
        if (tiles.tileAtLocationEquals(loc_in_list[0], tile)) {
            return true
        }
    }
    return false
}
function update_time () {
    secs_left_in_day += (game.runtime() - last_time) / 1000 * time_speed_multiplier * -1
    last_time = game.runtime()
    if (secs_left_in_day < 0) {
        secs_left_in_day = 86400 - Math.abs(secs_left_in_day)
    }
    secs_elapsed_today = 86400 - secs_left_in_day
    time_label.setText(format_time(secs_elapsed_today))
    time_label.right = scene.screenWidth() - 4
}
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
function change_watering_can_fill (by: number) {
    if (!(is_name_of_selected_item("Watering can"))) {
        return
    }
    item = toolbar.get_items()[toolbar.get_number(ToolbarNumberAttribute.SelectedIndex)]
    item.set_text(ItemTextAttribute.Tooltip, "" + Math.constrain(parseFloat(item.get_text(ItemTextAttribute.Tooltip)) + by, 0, 100))
    if (item.get_text(ItemTextAttribute.Tooltip).length < 3) {
        item.set_text(ItemTextAttribute.Tooltip, "" + item.get_text(ItemTextAttribute.Tooltip) + "%")
    }
    toolbar.update()
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
controller.A.onEvent(ControllerButtonEvent.Repeated, function () {
    if (!(in_inventory)) {
        do_action()
    }
})
function get_watering_can_fill () {
    if (!(is_name_of_selected_item("Watering can"))) {
        return 0
    }
    return parseFloat(toolbar.get_items()[toolbar.get_number(ToolbarNumberAttribute.SelectedIndex)].get_text(ItemTextAttribute.Tooltip))
}
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
    toolbar = Inventory.create_toolbar([], 2)
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
function on_day_end () {
	
}
function on_1_hour_before_day_end () {
	
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
function format_time (secs_elapsed: number) {
    formatted_hours_today = Math.floor(Math.round(secs_elapsed / 60) / 60)
    formatted_minutes_today = Math.round(secs_elapsed / 60) % 60
    formatted_time = "" + formatted_minutes_today
    if (formatted_time.length < 2) {
        formatted_time = "0" + formatted_time
    }
    formatted_time = "" + formatted_hours_today + ":" + formatted_time
    return formatted_time
}
function on_day_start () {
	
}
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_inventory) {
        move_left_in_inventory_toolbar()
    }
})
function have_something_selected_in_toolbar () {
    return !(!(toolbar.get_items()[toolbar.get_number(ToolbarNumberAttribute.SelectedIndex)]))
}
let formatted_time = ""
let formatted_minutes_today = 0
let formatted_hours_today = 0
let last_inventory_select = 0
let last_toolbar_select = 0
let label = ""
let cursor_in_inventory = false
let the_decoration: Sprite = null
let inventory: Inventory.Inventory = null
let rng_ground: FastRandomBlocks = null
let the_house: Sprite = null
let action_label: TextSprite = null
let item: Inventory.Item = null
let secs_elapsed_today = 0
let secs_left_in_day = 0
let last_time = 0
let time_label: TextSprite = null
let toolbar: Inventory.Toolbar = null
let can_last_use = false
let can_use = false
let the_player: Sprite = null
let in_inventory = false
let the_cursor: Sprite = null
let time_speed_multiplier = 0
stats.turnStats(true)
make_player()
load_environment_outside()
make_inventory_toolbar()
make_tile_cursor_and_action_label()
make_time_label()
give_starting_items()
controller.configureRepeatEventDefaults(333, 50)
time_speed_multiplier = 2400
game.onUpdate(function () {
    the_player.z = the_player.bottom / 100
    update_tile_cursor_and_action_label()
    update_time()
})
forever(function () {
    secs_left_in_day = 86400 - 8 * 3600
    secs_elapsed_today = 8 * 3600
    on_day_start()
    while (secs_elapsed_today <= 86400 - 5 * 3600) {
        pause(0)
    }
    on_1_hour_before_day_end()
    while (secs_elapsed_today <= 86400 - 4 * 3600) {
        pause(0)
    }
    on_day_end()
})
