namespace SpriteKind {
    export const House = SpriteKind.create()
    export const Decoration = SpriteKind.create()
    export const TileCursor = SpriteKind.create()
}
function create_item_with_tooltip (name: string, image2: Image, description: string, tooltip: string) {
    item = Inventory.create_item(name, image2, description)
    item.set_text(ItemTextAttribute.Tooltip, tooltip)
    return item
}
function get_stackable_item_count_name (name: string) {
    item = get_stackable_item_name(name)
    if (item) {
        return parseFloat(item.get_text(ItemTextAttribute.Tooltip))
    } else {
        return [][0]
    }
}
function do_action () {
    if (tile_at_loc_is_one_of([the_cursor.tilemapLocation()], [
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
    } else if (tile_at_loc_is_one_of([the_cursor.tilemapLocation()], [sprites.castle.rock0, sprites.castle.rock1]) && is_name_of_selected_item("Pickaxe")) {
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
    } else if (tile_at_loc_is_one_of([the_cursor.tilemapLocation()], non_fully_grown) && is_name_of_selected_item("Hoe")) {
        give_player_seed_of(tile_to_vegetable_name([the_cursor.tilemapLocation()]))
        tiles.setTileAt(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`)
    } else if (tile_at_loc_is_one_of([the_cursor.tilemapLocation()], fully_grown_tiles) && is_name_of_selected_item("Hoe")) {
        for (let index = 0; index < randint(1, 2); index++) {
            give_player_seed_of(tile_to_vegetable_name([the_cursor.tilemapLocation()]))
        }
        for (let index = 0; index < randint(2, 4); index++) {
            give_player_crop_of(tile_to_vegetable_name([the_cursor.tilemapLocation()]))
        }
        tiles.setTileAt(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`)
    }
}
function tile_to_vegetable_name (loc_in_list: any[]) {
    for (let tile of potato_stages) {
        if (tiles.tileAtLocationEquals(loc_in_list[0], tile)) {
            return "potato"
        }
    }
    for (let tile of carrot_stages) {
        if (tiles.tileAtLocationEquals(loc_in_list[0], tile)) {
            return "carrot"
        }
    }
    for (let tile of beetroot_stages) {
        if (tiles.tileAtLocationEquals(loc_in_list[0], tile)) {
            return "beetroot"
        }
    }
    for (let tile of lettuce_stages) {
        if (tiles.tileAtLocationEquals(loc_in_list[0], tile)) {
            return "lettuce"
        }
    }
    return "unknown"
}
function tick_time () {
    tick_plant(potato_stages, potato_next_stage_chance)
    tick_plant(carrot_stages, carrot_next_stage_chance)
    tick_plant(beetroot_stages, beetroot_next_stage_chance)
    tick_plant(lettuce_stages, lettuce_next_stage_chance)
    for (let index = 0; index <= degradation_path.length - 2; index++) {
        for (let location of tiles.getTilesByType(degradation_path[degradation_path.length - 2 - index])) {
            if (Math.percentChance(degradation_chances[degradation_path.length - 2 - index])) {
                tiles.setTileAt(location, degradation_path[degradation_path.length - 1 - index])
            }
        }
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
scene.onOverlapTile(SpriteKind.Player, assets.tile`house`, function (sprite, location) {
    if (sprite.tileKindAt(TileDirection.Center, assets.tile`house`)) {
        if (!(in_cutscene)) {
            if (!(in_menu) && !(in_inventory)) {
                open_action_menu()
            }
        }
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
function get_stackable_item_name (name: string) {
    for (let item of toolbar.get_items()) {
        if (item.get_text(ItemTextAttribute.Name) == name) {
            return item
        }
    }
    for (let item of inventory.get_items()) {
        if (item.get_text(ItemTextAttribute.Name) == name) {
            return item
        }
    }
    return [][0]
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_inventory) {
        handle_a_key_in_inventory_toolbar()
    } else if (in_menu) {
    	
    } else {
        do_action()
    }
})
function open_action_menu () {
    enable_movement(false)
    if (!(spriteutils.isDestroyed(menu_house))) {
        menu_house.destroy()
    }
    in_menu = true
    menu_house = miniMenu.createMenu(
    miniMenu.createMenuItem("Close"),
    miniMenu.createMenuItem("Sell...")
    )
    menu_house.setFlag(SpriteFlag.RelativeToCamera, true)
    menu_house.top = 4
    menu_house.left = 4
    menu_house.z = 20
    style_menu([menu_house], scene.screenWidth() - 8, scene.screenHeight() - 32, "Actions available")
    menu_house.setButtonEventsEnabled(false)
    menu_house.onButtonPressed(controller.A, function (selection, selectedIndex) {
        if (selectedIndex == 0) {
            menu_house.destroy()
            enable_movement(true)
            in_menu = false
            the_player.y += 16
        } else if (selectedIndex == 1) {
            menu_house.destroy()
            open_sell_menu()
        }
    })
    menu_house.onButtonPressed(controller.B, function (selection, selectedIndex) {
        menu_house.destroy()
        enable_movement(true)
        in_menu = false
        the_player.y += 16
    })
    timer.background(function () {
        while (controller.A.isPressed()) {
            pause(0)
        }
        menu_house.setButtonEventsEnabled(true)
    })
}
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
function give_player_seed_of (name: string) {
    if (name == "potato") {
        add_item([Inventory.create_item("Potato", assets.image`potato`, "0.25,sellable,")])
    } else if (name == "carrot") {
        add_item([Inventory.create_item("Carrot seed", assets.image`carrot_seed`, "0.1,sellable,")])
    } else if (name == "beetroot") {
        add_item([Inventory.create_item("Beetroot seed", assets.image`beetroot_seed`, "0.15,sellable,")])
    } else if (name == "lettuce") {
        add_item([Inventory.create_item("Lettuce seed", assets.image`lettuce_seed`, "0.2,sellable,")])
    }
}
function open_sell_menu () {
    enable_movement(false)
    if (!(spriteutils.isDestroyed(menu_sell))) {
        menu_sell.destroy()
    }
    in_menu = true
    menu_sell_options = [miniMenu.createMenuItem("Close")]
    if (menu_sell_selections.length == 0) {
        menu_sell_selections = []
        menu_sell_selections_max = []
        for (let index = 0; index <= inventory.get_items().length - 1; index++) {
            item = inventory.get_items()[index]
            description = item.get_text(ItemTextAttribute.Description)
            if (!(description)) {
                continue;
            }
            if (item.get_text(ItemTextAttribute.Description).includes("sellable")) {
                menu_sell_selections.push(0)
                if (item.get_text(ItemTextAttribute.Tooltip) == "") {
                    menu_sell_selections_max.push(1)
                } else {
                    menu_sell_selections_max.push(parseFloat(item.get_text(ItemTextAttribute.Tooltip)))
                }
            }
        }
        for (let index = 0; index <= toolbar.get_items().length - 1; index++) {
            item = toolbar.get_items()[index]
            description = item.get_text(ItemTextAttribute.Description)
            if (!(description)) {
                continue;
            }
            if (item.get_text(ItemTextAttribute.Description).includes("sellable")) {
                menu_sell_selections.push(0)
                if (item.get_text(ItemTextAttribute.Tooltip) == "") {
                    menu_sell_selections_max.push(1)
                } else {
                    menu_sell_selections_max.push(parseFloat(item.get_text(ItemTextAttribute.Tooltip)))
                }
            }
        }
    }
    sell_price = 0
    real_index = 0
    for (let index = 0; index <= inventory.get_items().length - 1; index++) {
        item = inventory.get_items()[index]
        description = item.get_text(ItemTextAttribute.Description)
        if (!(description)) {
            continue;
        }
        if (item.get_text(ItemTextAttribute.Description).includes("sellable")) {
            if (item.get_text(ItemTextAttribute.Tooltip) == "") {
                menu_sell_options.push(miniMenu.createMenuItem("" + menu_sell_selections[real_index] + "/" + "1" + ": " + item.get_text(ItemTextAttribute.Name)))
            } else {
                menu_sell_options.push(miniMenu.createMenuItem("" + menu_sell_selections[real_index] + "/" + item.get_text(ItemTextAttribute.Tooltip) + ": " + item.get_text(ItemTextAttribute.Name)))
            }
            sell_price += menu_sell_selections[real_index] * parseFloat(item.get_text(ItemTextAttribute.Description))
            real_index += 1
        }
    }
    real_index = 0
    for (let index = 0; index <= toolbar.get_items().length - 1; index++) {
        item = toolbar.get_items()[index]
        description = item.get_text(ItemTextAttribute.Description)
        if (!(description)) {
            continue;
        }
        if (item.get_text(ItemTextAttribute.Description).includes("sellable")) {
            if (item.get_text(ItemTextAttribute.Tooltip) == "") {
                menu_sell_options.push(miniMenu.createMenuItem("" + menu_sell_selections[real_index] + "/" + "1" + ": " + item.get_text(ItemTextAttribute.Name)))
            } else {
                menu_sell_options.push(miniMenu.createMenuItem("" + menu_sell_selections[real_index] + "/" + item.get_text(ItemTextAttribute.Tooltip) + ": " + item.get_text(ItemTextAttribute.Name)))
            }
            sell_price += menu_sell_selections[real_index] * parseFloat(item.get_text(ItemTextAttribute.Description))
            real_index += 1
        }
    }
    menu_sell_options.insertAt(1, miniMenu.createMenuItem("Sell for $" + sell_price))
    menu_sell = miniMenu.createMenuFromArray(menu_sell_options)
    for (let index = 0; index < menu_sell_last_index; index++) {
        menu_sell.moveSelection(miniMenu.MoveDirection.Down)
    }
    menu_sell.setFlag(SpriteFlag.RelativeToCamera, true)
    menu_sell.top = 4
    menu_sell.left = 4
    menu_sell.z = 20
    style_menu([menu_sell], scene.screenWidth() - 8, scene.screenHeight() - 32, "Sell vegetables")
    menu_sell.setButtonEventsEnabled(false)
    menu_sell.onButtonPressed(controller.A, function (selection, selectedIndex) {
        if (selectedIndex == 0) {
            menu_sell_last_index = 0
            menu_sell_selections = []
            menu_sell_selections_max = []
            menu_sell.destroy()
            open_action_menu()
        } else if (selectedIndex == 1) {
            menu_sell_selections = []
            menu_sell_selections_max = []
            menu_sell.destroy()
            enable_movement(true)
            in_menu = false
            the_player.y += 16
        } else {
            if (menu_sell_selections[selectedIndex - 2] < menu_sell_selections_max[selectedIndex - 2]) {
                menu_sell_selections[selectedIndex - 2] = menu_sell_selections[selectedIndex - 2] + 1
                menu_sell_last_index = selectedIndex
                menu_sell.destroy()
                open_sell_menu()
            }
        }
    })
    menu_sell.onButtonPressed(controller.B, function (selection, selectedIndex) {
        if (selectedIndex == 0 || selectedIndex == 1) {
            menu_sell_last_index = 0
            menu_sell_selections = []
            menu_sell_selections_max = []
            menu_sell.destroy()
            open_action_menu()
        } else {
            if (menu_sell_selections[selectedIndex - 2] > 0) {
                menu_sell_selections[selectedIndex - 2] = menu_sell_selections[selectedIndex - 2] - 1
                menu_sell_last_index = selectedIndex
                menu_sell.destroy()
                open_sell_menu()
            }
        }
    })
    menu_sell.onButtonPressed(controller.menu, function (selection, selectedIndex) {
        if (selectedIndex == 0 || selectedIndex == 1) {
        	
        } else {
            menu_sell_selections[selectedIndex - 2] = menu_sell_selections_max[selectedIndex - 2]
            menu_sell_last_index = selectedIndex
            menu_sell.destroy()
            open_sell_menu()
        }
    })
    timer.background(function () {
        while (controller.A.isPressed()) {
            pause(0)
        }
        menu_sell.setButtonEventsEnabled(true)
    })
}
function change_stackable_item_count_name (name: string, by: number) {
    item = get_stackable_item_name(name)
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
    inventory.update()
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
function style_menu (menu_in_list: any[], width: number, height: number, title: string) {
    menu_in_list[0].setDimensions(width, height)
    menu_in_list[0].setTitle(title)
    menu_in_list[0].setMenuStyleProperty(miniMenu.MenuStyleProperty.Border, 1)
    menu_in_list[0].setMenuStyleProperty(miniMenu.MenuStyleProperty.BorderColor, images.colorBlock(12))
    menu_in_list[0].setMenuStyleProperty(miniMenu.MenuStyleProperty.BackgroundColor, images.colorBlock(13))
    menu_in_list[0].setMenuStyleProperty(miniMenu.MenuStyleProperty.ScrollIndicatorColor, images.colorBlock(12))
    menu_in_list[0].setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, images.colorBlock(12))
    menu_in_list[0].setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, images.colorBlock(13))
    menu_in_list[0].setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, images.colorBlock(13))
    menu_in_list[0].setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, images.colorBlock(11))
    menu_in_list[0].setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Foreground, images.colorBlock(13))
    menu_in_list[0].setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Background, images.colorBlock(12))
}
function give_starting_items () {
    inventory.get_items().push(Inventory.create_item("Pickaxe", assets.image`pickaxe_1`))
    inventory.get_items().push(Inventory.create_item("Axe", assets.image`axe`))
    inventory.get_items().push(Inventory.create_item("Shovel", assets.image`shovel`))
    inventory.get_items().push(Inventory.create_item("Hoe", assets.image`hoe`))
    inventory.get_items().push(create_item_with_tooltip("Watering can", assets.image`watering_can`, "", "0%"))
    seed_rng = Random.createRNG(3)
    inventory.get_items().push(create_item_with_tooltip("Potato", assets.image`potato`, "0.25,sellable,", "" + seed_rng.randomRange(5, 10)))
    inventory.get_items().push(create_item_with_tooltip("Carrot seed", assets.image`carrot_seed`, "0.1,sellable,", "" + seed_rng.randomRange(5, 10)))
    inventory.get_items().push(create_item_with_tooltip("Beetroot seed", assets.image`beetroot_seed`, "0.15,sellable,", "" + seed_rng.randomRange(5, 10)))
    inventory.get_items().push(create_item_with_tooltip("Lettuce seed", assets.image`lettuce_seed`, "0.2,sellable,", "" + seed_rng.randomRange(5, 10)))
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
function set_watering_can_fill (_new: number) {
    item = get_stackable_item_name("Watering can")
    item.set_text(ItemTextAttribute.Tooltip, "" + _new)
    if (item.get_text(ItemTextAttribute.Tooltip).length < 3) {
        item.set_text(ItemTextAttribute.Tooltip, "" + item.get_text(ItemTextAttribute.Tooltip) + "%")
    }
    toolbar.update()
    inventory.update()
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
    in_cutscene = !(en)
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
    miniMenu.createMenuItem("Set seed count to 500"),
    miniMenu.createMenuItem("Set watering can fill to 500"),
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
    style_menu([menu_debug], scene.screenWidth() - 8, scene.screenHeight() - 32, "Debug menu")
    menu_debug.setButtonEventsEnabled(false)
    menu_debug.onButtonPressed(controller.A, function (selection, selectedIndex) {
        if (selectedIndex == 0) {
            menu_debug.destroy()
            enable_movement(true)
            in_menu = false
        } else if (selectedIndex == 1) {
            set_stackable_item_count_name("Potato", 500)
            set_stackable_item_count_name("Carrot seed", 500)
            set_stackable_item_count_name("Beetroot seed", 500)
            set_stackable_item_count_name("Lettuce seed", 500)
        } else if (selectedIndex == 2) {
            set_watering_can_fill(500)
        } else if (selectedIndex == 3) {
            secs_left_in_day = 86400 - 8 * 3600
            secs_elapsed_today = 8 * 3600
        } else if (selectedIndex == 4) {
            secs_left_in_day = 4 * 3600
            secs_elapsed_today = 86400 - 4 * 3600
            menu_debug.destroy()
            in_menu = false
        } else if (selectedIndex == 5) {
            tick_time()
        } else if (selectedIndex == 6) {
            tick_plant(potato_stages, 100)
            tick_plant(carrot_stages, 100)
            tick_plant(beetroot_stages, 100)
            tick_plant(lettuce_stages, 100)
        } else if (selectedIndex == 7) {
            tick_plant(potato_stages, -100)
            tick_plant(carrot_stages, -100)
            tick_plant(beetroot_stages, -100)
            tick_plant(lettuce_stages, -100)
        } else if (selectedIndex == 8) {
            for (let tile of fully_grown_tiles) {
                for (let location of tiles.getTilesByType(tile)) {
                    for (let index = 0; index < randint(1, 2); index++) {
                        give_player_seed_of(tile_to_vegetable_name([location]))
                    }
                    for (let index = 0; index < randint(2, 4); index++) {
                        give_player_crop_of(tile_to_vegetable_name([location]))
                    }
                    tiles.setTileAt(location, assets.tile`tilled_wet_dirt`)
                }
            }
        } else if (selectedIndex == 9) {
        	
        } else if (selectedIndex == 10) {
        	
        } else if (selectedIndex == 11) {
        	
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
    if (tile_at_loc_is_one_of([the_cursor.tilemapLocation()], [
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
    } else if (tile_at_loc_is_one_of([the_cursor.tilemapLocation()], [sprites.castle.rock0, sprites.castle.rock1]) && is_name_of_selected_item("Pickaxe")) {
        label = "Remove rock"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`water`) && is_name_of_selected_item("Watering can") && get_watering_can_fill() < 100) {
        label = "Fill watering can"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), sprites.castle.tilePath5) && is_name_of_selected_item("Watering can") && get_watering_can_fill() >= 10) {
        label = "Water dirt"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Potato")) {
        label = "Plant seed"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Carrot seed")) {
        label = "Plant seed"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Beetroot seed")) {
        label = "Plant seed"
    } else if (tiles.tileAtLocationEquals(the_cursor.tilemapLocation(), assets.tile`tilled_wet_dirt`) && is_name_of_selected_item("Lettuce seed")) {
        label = "Plant seed"
    } else if (is_name_of_selected_item("Debug menu")) {
        label = "Open debug menu"
    } else if (tile_at_loc_is_one_of([the_cursor.tilemapLocation()], non_fully_grown) && is_name_of_selected_item("Hoe")) {
        label = "Uproot plant"
    } else if (tile_at_loc_is_one_of([the_cursor.tilemapLocation()], fully_grown_tiles) && is_name_of_selected_item("Hoe")) {
        label = "Harvest plant"
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
    item = get_stackable_item_name("Watering can")
    item.set_text(ItemTextAttribute.Tooltip, "" + Math.constrain(parseFloat(item.get_text(ItemTextAttribute.Tooltip)) + by, 0, 100))
    if (item.get_text(ItemTextAttribute.Tooltip).length < 3) {
        item.set_text(ItemTextAttribute.Tooltip, "" + item.get_text(ItemTextAttribute.Tooltip) + "%")
    }
    toolbar.update()
    inventory.update()
}
function give_player_crop_of (name: string) {
    if (name == "potato") {
        add_item([Inventory.create_item("Potato", assets.image`potato`, "0.25,sellable,")])
    } else if (name == "carrot") {
        add_item([Inventory.create_item("Carrot", assets.image`carrot`, "0.2,sellable,")])
    } else if (name == "beetroot") {
        add_item([Inventory.create_item("Beetroot", assets.image`beetroot`, "0.3,sellable,")])
    } else if (name == "lettuce") {
        add_item([Inventory.create_item("Lettuce", assets.image`lettuce`, "1,sellable,")])
    }
}
function tick_plant (stages: any[], percent_chance: number) {
    if (percent_chance < 0) {
        for (let index = 0; index <= stages.length - 1; index++) {
            for (let location of tiles.getTilesByType(stages[index])) {
                if (Math.percentChance(Math.abs(percent_chance))) {
                    tiles.setTileAt(location, stages[Math.max(index - 1, 0)])
                }
            }
        }
    } else {
        for (let index = 0; index <= stages.length - 1; index++) {
            for (let location of tiles.getTilesByType(stages[stages.length - 1 - index])) {
                if (Math.percentChance(percent_chance)) {
                    tiles.setTileAt(location, stages[Math.min(stages.length - 1 - index + 1, stages.length - 1)])
                }
            }
        }
    }
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
    if (in_inventory) {
        handle_menu_key_in_inventory_toolbar()
    } else if (in_menu) {
    	
    } else {
        handle_menu_key_in_inventory_toolbar()
    }
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
function set_stackable_item_count_name (name: string, _new: number) {
    item = get_stackable_item_name(name)
    item.set_text(ItemTextAttribute.Tooltip, "" + _new)
    if (item.get_text(ItemTextAttribute.Tooltip) == "1") {
        item.set_text(ItemTextAttribute.Tooltip, "")
    } else if (item.get_text(ItemTextAttribute.Tooltip) == "0") {
        toolbar.get_items().removeAt(toolbar.get_number(ToolbarNumberAttribute.SelectedIndex))
    }
    toolbar.update()
    inventory.update()
}
function get_watering_can_fill () {
    return parseFloat(get_stackable_item_name("Watering can").get_text(ItemTextAttribute.Tooltip))
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
    tick_time()
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
    the_player.y += 8
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
function tile_at_loc_is_one_of (loc_in_list: any[], tiles2: any[]) {
    for (let tile of tiles2) {
        if (tiles.tileAtLocationEquals(loc_in_list[0], tile)) {
            return true
        }
    }
    return false
}
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
let rng_ground: FastRandomBlocks = null
let the_house: Sprite = null
let menu_sell_last_index = 0
let real_index = 0
let sell_price = 0
let description = ""
let menu_sell_selections_max: number[] = []
let menu_sell_selections: number[] = []
let menu_sell_options: miniMenu.MenuItem[] = []
let menu_sell: miniMenu.MenuSprite = null
let menu_house: miniMenu.MenuSprite = null
let inventory: Inventory.Inventory = null
let action_label: TextSprite = null
let in_cutscene = false
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
let degradation_chances: number[] = []
let degradation_path: Image[] = []
let fully_grown_tiles: Image[] = []
let non_fully_grown: Image[] = []
let lettuce_next_stage_chance = 0
let lettuce_stages: Image[] = []
let beetroot_next_stage_chance = 0
let beetroot_stages: Image[] = []
let carrot_next_stage_chance = 0
let carrot_stages: Image[] = []
let potato_next_stage_chance = 0
let potato_stages: Image[] = []
let DEBUG_menu = false
let DEBUG_tilemap = false
DEBUG_tilemap = true
DEBUG_menu = true
stats.turnStats(true)
color.setPalette(
color.Black
)
potato_stages = [
assets.tile`tilled_wet_dirt_with_potato_1`,
assets.tile`tilled_wet_dirt_with_potato_2`,
assets.tile`tilled_wet_dirt_with_potato_3`,
assets.tile`tilled_wet_dirt_with_potato_4`
]
potato_next_stage_chance = 40
carrot_stages = [
assets.tile`tilled_wet_dirt_with_carrot_1`,
assets.tile`tilled_wet_dirt_with_carrot_2`,
assets.tile`tilled_wet_dirt_with_carrot_3`,
assets.tile`tilled_wet_dirt_with_carrot_4`
]
carrot_next_stage_chance = 50
beetroot_stages = [
assets.tile`tilled_wet_dirt_with_beetroot_1`,
assets.tile`tilled_wet_dirt_with_beetroot_2`,
assets.tile`tilled_wet_dirt_with_beetroot_3`,
assets.tile`tilled_wet_dirt_with_beetroot_4`
]
beetroot_next_stage_chance = 60
lettuce_stages = [
assets.tile`tilled_wet_dirt_with_lettuce_1`,
assets.tile`tilled_wet_dirt_with_lettuce_2`,
assets.tile`tilled_wet_dirt_with_lettuce_3`,
assets.tile`tilled_wet_dirt_with_lettuce_4`
]
lettuce_next_stage_chance = 70
non_fully_grown = []
for (let index = 0; index <= potato_stages.length - 2; index++) {
    non_fully_grown.push(potato_stages[index])
}
for (let index = 0; index <= carrot_stages.length - 2; index++) {
    non_fully_grown.push(carrot_stages[index])
}
for (let index = 0; index <= beetroot_stages.length - 2; index++) {
    non_fully_grown.push(beetroot_stages[index])
}
for (let index = 0; index <= lettuce_stages.length - 2; index++) {
    non_fully_grown.push(lettuce_stages[index])
}
fully_grown_tiles = [
potato_stages[potato_stages.length - 1],
carrot_stages[carrot_stages.length - 1],
beetroot_stages[beetroot_stages.length - 1],
lettuce_stages[lettuce_stages.length - 1]
]
degradation_path = [assets.tile`wet_dirt`, sprites.castle.tilePath5, assets.tile`grass`]
degradation_chances = [20, 30, 0]
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
