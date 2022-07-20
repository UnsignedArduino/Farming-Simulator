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
controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_inventory) {
        move_right_in_inventory_toolbar()
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_inventory) {
        move_left_in_inventory_toolbar()
    }
})
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
        controller.moveSprite(the_player)
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
    the_player = sprites.create(img`
        . . . . . . f f f f . . . . . . 
        . . . . f f f 2 2 f f f . . . . 
        . . . f f f 2 2 2 2 f f f . . . 
        . . f f f e e e e e e f f f . . 
        . . f f e 2 2 2 2 2 2 e e f . . 
        . . f e 2 f f f f f f 2 e f . . 
        . . f f f f e e e e f f f f . . 
        . f f e f b f 4 4 f b f e f f . 
        . f e e 4 1 f d d f 1 4 e e f . 
        . . f e e d d d d d d e e f . . 
        . . . f e e 4 4 4 4 e e f . . . 
        . . e 4 f 2 2 2 2 2 2 f 4 e . . 
        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
        . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
        . . . . . f f f f f f . . . . . 
        . . . . . f f . . f f . . . . . 
        `, SpriteKind.Player)
    the_player.setFlag(SpriteFlag.StayInScreen, true)
    the_player.z = 10
    enable_movement(true)
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
function prepare_environment () {
    scene.setBackgroundColor(7)
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
let the_player: Sprite = null
let inventory: Inventory.Inventory = null
let cursor_in_inventory = false
let toolbar: Inventory.Toolbar = null
let item: Inventory.Item = null
let in_inventory = false
prepare_environment()
make_player()
make_inventory_toolbar()
controller.configureRepeatEventDefaults(333, 50)
