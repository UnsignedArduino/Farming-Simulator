namespace SpriteKind {
    export const House = SpriteKind.create()
    export const Decoration = SpriteKind.create()
    export const TileCursor = SpriteKind.create()
}
function create_item_with_tooltip (name: string, image2: Image, tooltip: string) {
    item = Inventory.create_item(name, image2)
    item.set_text(ItemTextAttribute.Tooltip, tooltip)
    return item
}
function do_action () {
    if (tile_at_loc_is_one_off([the_cursor.tilemapLocation()], [
    assets.tile`grass`,
    sprites.castle.tileGrass1,
    sprites.castle.tileGrass3,
    sprites.castle.tileGrass2
    ]) && is_name_of_selected_item("Shovel")) {
        tiles.setTileAt(the_cursor.tilemapLocation(), sprites.castle.tilePath5)
        remove_decoration([the_cursor.tilemapLocation()])
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
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Potato")) {
        tiles.setTileAt(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt_with_potato_1`)
        change_stackable_item_count(-1)
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Carrot seed")) {
        tiles.setTileAt(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt_with_carrot_1`)
        change_stackable_item_count(-1)
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Beetroot seed")) {
        tiles.setTileAt(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt_with_beetroot_1`)
        change_stackable_item_count(-1)
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Lettuce seed")) {
        tiles.setTileAt(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt_with_lettuce_1`)
        change_stackable_item_count(-1)
    } else if (is_name_of_selected_item("Debug menu")) {
        open_debug_menu()
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
    the_cursor.setFlag(SpriteFlag.Invisible, !(have_something_selected_in_toolbar()) || is_name_of_selected_item("Debug menu"))
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
    if (DEBUG_tilemap || DEBUG_menu) {
        time_label = textsprite.create("8:00", 1, 2)
        time_label.setBorder(1, 2, 1)
    } else {
        time_label = textsprite.create("8:00", 13, 12)
        time_label.setBorder(1, 12, 1)
    }
    time_label.setFlag(SpriteFlag.RelativeToCamera, true)
    time_label.z = 20
    time_label.top = 4
    last_time = game.runtime()
    secs_left_in_day = 86400 - 8 * 3600
    secs_elapsed_today = 0
    update_time()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_inventory) {
        handle_b_key_in_inventory_toolbar()
    } else if (in_menu) {
    	
    } else {
        handle_b_key_in_inventory_toolbar()
    }
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
function change_stackable_item_count (by: number) {
    item = toolbar.get_items()[toolbar.get_number(ToolbarNumberAttribute.SelectedIndex)]
    if (item.get_text(ItemTextAttribute.Tooltip) == "") {
        item.set_text(ItemTextAttribute.Tooltip, "1")
    }
    item.set_text(ItemTextAttribute.Tooltip, "" + (parseFloat(item.get_text(ItemTextAttribute.Tooltip)) + by))
    if (item.get_text(ItemTextAttribute.Tooltip) == "1") {
        item.set_text(ItemTextAttribute.Tooltip, "")
    } else if (item.get_text(ItemTextAttribute.Tooltip) == "0") {
        toolbar.get_items().removeAt(toolbar.get_number(ToolbarNumberAttribute.SelectedIndex))
    }
    toolbar.update()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_inventory) {
        handle_a_key_in_inventory_toolbar()
    } else if (in_menu) {
    	
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
function remove_decoration (loc_in_list: any[]) {
    for (let the_decoration of sprites.allOfKind(SpriteKind.Decoration)) {
        if (same_locations([loc_in_list[0], the_decoration.tilemapLocation()])) {
            the_decoration.destroy()
        }
    }
}
controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_inventory) {
        move_right_in_inventory_toolbar()
    }
})
function load_environment_outside () {
    scene.setBackgroundColor(7)
    if (DEBUG_tilemap) {
        tiles.setCurrentTilemap(tilemap`outside_debug`)
    } else {
        tiles.setCurrentTilemap(tilemap`outside`)
    }
    scene.cameraFollowSprite(the_player)
    the_house = sprites.create(assets.image`house`, SpriteKind.House)
    tiles.placeOnTile(the_house, tiles.getTilesByType(assets.tile`house`)[0])
    the_house.y += -16
    the_house.z = the_house.bottom / 100
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
    for (let index = 0; index < 5; index++) {
        place_decoration(sprites.castle.rock1, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 0, false)
    }
    for (let index = 0; index < 5; index++) {
        place_decoration(assets.tile`stump`, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 0, false)
    }
    for (let index = 0; index < 5; index++) {
        place_decoration(sprites.castle.rock0, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 0, false)
    }
    for (let index = 0; index < 20; index++) {
        place_decoration(assets.image`flower_1`, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 2 / 16, true)
    }
    for (let index = 0; index < 20; index++) {
        place_decoration(assets.image`flower_2`, [rng_ground.randomElement(tiles.getTilesByType(assets.tile`grass`))], 2 / 16, true)
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
    inventory.get_items().push(create_item_with_tooltip("Watering can", assets.image`watering_can`, "0%"))
    seed_rng = Random.createRNG(3)
    inventory.get_items().push(create_item_with_tooltip("Potato", assets.image`potato`, "" + seed_rng.randomRange(5, 10)))
    inventory.get_items().push(create_item_with_tooltip("Carrot seed", assets.image`carrot_seed`, "" + seed_rng.randomRange(5, 10)))
    inventory.get_items().push(create_item_with_tooltip("Beetroot seed", assets.image`beetroot_seed`, "" + seed_rng.randomRange(5, 10)))
    inventory.get_items().push(create_item_with_tooltip("Lettuce seed", assets.image`lettuce_seed`, "" + seed_rng.randomRange(5, 10)))
    inventory.update()
    if (DEBUG_menu) {
        toolbar.get_items().push(Inventory.create_item("Debug menu", assets.image`popup_debug_menu`))
        toolbar.update()
    }
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
function open_debug_menu () {
    enable_movement(false)
    if (!(spriteutils.isDestroyed(menu_debug))) {
        menu_debug.destroy()
    }
    in_menu = true
    menu_debug = miniMenu.createMenu(
    miniMenu.createMenuItem("Close"),
    miniMenu.createMenuItem("Give lots of seeds"),
    miniMenu.createMenuItem("Overfill watering can"),
    miniMenu.createMenuItem("Reset day clock"),
    miniMenu.createMenuItem("Go to end of day"),
    miniMenu.createMenuItem("Tick plants"),
    miniMenu.createMenuItem("Increase stage of all plants"),
    miniMenu.createMenuItem("Decrease stage of all plants"),
    miniMenu.createMenuItem("Harvest all grown plants"),
    miniMenu.createMenuItem("Remove all plants"),
    miniMenu.createMenuItem("Water all dirt"),
    miniMenu.createMenuItem("Till all wet dirt")
    )
    menu_debug.setFlag(SpriteFlag.RelativeToCamera, true)
    menu_debug.top = 4
    menu_debug.left = 4
    menu_debug.z = 20
    menu_debug.setDimensions(scene.screenWidth() - 8, scene.screenHeight() - 32)
    menu_debug.setTitle("Debug menu")
    menu_debug.setMenuStyleProperty(miniMenu.MenuStyleProperty.Border, 1)
    menu_debug.setMenuStyleProperty(miniMenu.MenuStyleProperty.BorderColor, images.colorBlock(12))
    menu_debug.setMenuStyleProperty(miniMenu.MenuStyleProperty.BackgroundColor, images.colorBlock(13))
    menu_debug.setMenuStyleProperty(miniMenu.MenuStyleProperty.ScrollIndicatorColor, images.colorBlock(12))
    menu_debug.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, images.colorBlock(12))
    menu_debug.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, images.colorBlock(13))
    menu_debug.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, images.colorBlock(13))
    menu_debug.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, images.colorBlock(11))
    menu_debug.setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Foreground, images.colorBlock(13))
    menu_debug.setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Background, images.colorBlock(12))
    menu_debug.setButtonEventsEnabled(false)
    menu_debug.onButtonPressed(controller.A, function (selection, selectedIndex) {
        if (selectedIndex == 0) {
            menu_debug.destroy()
            enable_movement(true)
            in_menu = false
        }
    })
    menu_debug.onButtonPressed(controller.B, function (selection, selectedIndex) {
        menu_debug.destroy()
        enable_movement(true)
        in_menu = false
    })
    timer.background(function () {
        while (controller.A.isPressed()) {
            pause(0)
        }
        menu_debug.setButtonEventsEnabled(true)
    })
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
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Potato")) {
        label = "Plant potato"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Carrot seed")) {
        label = "Plant carrot seed"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Beetroot seed")) {
        label = "Plant beetroot seed"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Lettuce seed")) {
        label = "Plant lettuce seed"
    } else if (is_name_of_selected_item("Debug menu")) {
        label = "Open debug menu"
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
function screen_shade (amount: number) {
    if (!(spriteutils.isDestroyed(screen_shader))) {
        screen_shader.destroy()
    }
    if (amount == -1) {
        return
    }
    screen_shader = shader.createRectangularShaderSprite(scene.screenWidth(), scene.screenHeight(), amount)
    screen_shader.setFlag(SpriteFlag.RelativeToCamera, true)
    screen_shader.setPosition(scene.screenWidth() / 2, scene.screenHeight() / 2)
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    handle_menu_key_in_inventory_toolbar()
})
controller.A.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_inventory) {
    	
    } else if (in_menu) {
    	
    } else {
        do_action()
    }
})
function same_locations (locs_in_list: any[]) {
    col = locs_in_list[0].column
    row = locs_in_list[0].row
    for (let location of locs_in_list) {
        if (col != location.column) {
            return false
        }
        if (row != location.row) {
            return false
        }
    }
    return true
}
function get_watering_can_fill () {
    if (!(is_name_of_selected_item("Watering can"))) {
        return 0
    }
    return parseFloat(toolbar.get_items()[toolbar.get_number(ToolbarNumberAttribute.SelectedIndex)].get_text(ItemTextAttribute.Tooltip))
}
function get_stackable_item_count () {
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
function fade (in_or_out: boolean, block: boolean) {
    if (in_or_out) {
        color.startFade(color.originalPalette, color.Black, 2000)
    } else {
        color.startFade(color.Black, color.originalPalette, 2000)
    }
    if (block) {
        color.pauseUntilFadeDone()
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
    enable_movement(false)
    screen_shade(shader.ShadeLevel.Two)
    scene.followPath(the_player, scene.aStar(the_player.tilemapLocation(), tiles.getTilesByType(assets.tile`house`)[0]), 80)
    fade(true, true)
    scene.followPath(the_player, scene.aStar(the_player.tilemapLocation(), the_player.tilemapLocation()), 0)
    screen_shade(-1)
}
function on_1_hour_before_day_end () {
    screen_shade(shader.ShadeLevel.One)
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
    tiles.placeOnTile(the_player, tiles.getTilesByType(assets.tile`house`)[0])
    the_player.y += 1
    characterAnimations.setCharacterState(the_player, characterAnimations.rule(Predicate.FacingDown, Predicate.NotMoving))
    timer.background(function () {
        while (!(controller.anyButton.isPressed())) {
            pause(0)
        }
        if (!(in_inventory) && !(in_menu)) {
            enable_movement(true)
        }
        characterAnimations.clearCharacterState(the_player)
    })
    fade(false, false)
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
let row = 0
let col = 0
let screen_shader: Sprite = null
let label = ""
let menu_debug: miniMenu.MenuSprite = null
let cursor_in_inventory = false
let the_decoration: Sprite = null
let seed_rng: FastRandomBlocks = null
let inventory: Inventory.Inventory = null
let rng_ground: FastRandomBlocks = null
let the_house: Sprite = null
let action_label: TextSprite = null
let in_menu = false
let last_time = 0
let time_label: TextSprite = null
let toolbar: Inventory.Toolbar = null
let can_last_use = false
let can_use = false
let the_player: Sprite = null
let in_inventory = false
let the_cursor: Sprite = null
let item: Inventory.Item = null
let secs_elapsed_today = 0
let secs_left_in_day = 0
let time_speed_multiplier = 0
let DEBUG_menu = false
let DEBUG_tilemap = false
DEBUG_tilemap = true
DEBUG_menu = true
stats.turnStats(true)
color.setPalette(
color.Black
)
let potato_stages = [
assets.tile`tilled_wet_dirt_with_potato_1`,
assets.tile`tilled_wet_dirt_with_potato_2`,
assets.tile`tilled_wet_dirt_with_potato_3`,
assets.tile`tilled_wet_dirt_with_potato_4`
]
let potato_next_stage_chance = 40
let carrot_stages = [
assets.tile`tilled_wet_dirt_with_carrot_1`,
assets.tile`tilled_wet_dirt_with_carrot_2`,
assets.tile`tilled_wet_dirt_with_carrot_3`,
assets.tile`tilled_wet_dirt_with_carrot_4`
]
let carrot_next_stage_chance = 50
let beetroot_stages = [
assets.tile`tilled_wet_dirt_with_beetroot_1`,
assets.tile`tilled_wet_dirt_with_beetroot_2`,
assets.tile`tilled_wet_dirt_with_beetroot_3`,
assets.tile`tilled_wet_dirt_with_beetroot_4`
]
let beetroot_next_stage_chance = 60
let lettuce_stages = [
assets.tile`tilled_wet_dirt_with_lettuce_1`,
assets.tile`tilled_wet_dirt_with_lettuce_2`,
assets.tile`tilled_wet_dirt_with_lettuce_3`,
assets.tile`tilled_wet_dirt_with_lettuce_4`
]
let lettuce_next_stage_chance = 70
make_player()
load_environment_outside()
make_inventory_toolbar()
make_tile_cursor_and_action_label()
make_time_label()
give_starting_items()
controller.configureRepeatEventDefaults(333, 50)
time_speed_multiplier = 240 * 1
timer.background(function () {
    while (true) {
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
        pause(2000)
    }
})
game.onUpdate(function () {
    the_player.z = the_player.bottom / 100
    update_tile_cursor_and_action_label()
    update_time()
})
