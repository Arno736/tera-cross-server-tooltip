module.exports = function CrossServerTooltip(mod) {    
    let paperdoll;
    mod.hook('S_USER_PAPERDOLL_INFO', 13, (event) => { paperdoll = event; });
    mod.hook('C_SHOW_ITEM_TOOLTIP_EX', 6, (event) => {
        // 64bit make that some other servers player are considered playing on the same server
        // if (event.serverId == 0) return; // Same sever detected (64bit bug : other server player = 0)
        
        if (!mod.game.me.inDungeon) return;

        if (paperdoll == undefined) return; // Paperdoll is not defined

        let item;
        for(let i = 0; i < paperdoll.items.length; i++) {
            if (paperdoll.items[i].dbid == event.dbid) {
                item = paperdoll.items[i];
                break;
            }
        }

        if (item == undefined) return; // Abort if no item found

        // Add cristals on earrings and rings
        let crystals = [];
        if ([6, 7, 8, 9].includes(item.slot)) {
            if (item.crystal1 != 0) crystals.push(item.crystal1);
        }
        
        // Show ToolTip
        mod.toClient('S_SHOW_ITEM_TOOLTIP', 16, {
            type: 24,
            id: item.id,
            dbid: item.dbid,
            dbid2: item.dbid,
            ownerId: item.playerId,
            container: item.container,
            slot: item.slot,
            amount: item.amount,
            enchant: 0,
            soulbound: item.soulbound,
            passivitySets: item.passivitySets,
            soulboundName: paperdoll.name,
            passivitySet: item.passivitySet,
            passivitySets: item.passivitySets,
            extraPassivitySets: item.extraPassivitySets,
            mergedPassivities: item.mergedPassivities,
            crystals: crystals,
            secRemaining: -2
        });
        
        return false;
    });
}