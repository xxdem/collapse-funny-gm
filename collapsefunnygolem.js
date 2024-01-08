////////// TRANSFERRED DATA //////////
//      load stuff from part one


// NON-DESTRUCTIVE COMBAT ACTION MODIFICATION
if(check('collapseSave') && check('collapseSave').pageFlags['PAGE!!checkedguns']) {
    env.COMBAT_ACTORS.akizet.actions[0] = 'akizet_mag_dump'
}

if(check('collapseSave') && check('collapseSave').pageFlags['PAGE!!unlocked_black_box']) {
    env.COMBAT_ACTORS.gakvu.actions[0] = 'gakvu_mag_dump'
}

if(check('collapseSave') && check('collapseSave').pageFlags['PAGE!!barfriend']) {
    env.COMBAT_ACTORS.tozik.actions[1] = 'beer_splash'
}


// COMBAT ACTIONS
env.ACTIONS.akizet_mag_dump = {
    slug: "akizet_mag_dump",
    name: "Mag Dump",
    type: 'special',
    desc: "'uses SCAR-L';'rapid attacks'",
    anim: "wobble",
    help: "x30 RANDOM ENEMY::100% -1HP 33%C -2HP +1T:VULNERABLE",
    usage: {
        act: "%USER OPEN FIRES",
    },
    accuracy: 1,
    crit: 0.33,
    amt: 1,
    exec: function(user, target) {
        let animElement = user.sprite || user.box
        let initialRate = env.bgm.rate()

        animElement.classList.add('scramble')
        ratween(env.bgm, initialRate + 0.5)
        play('click1', 1, 1)

        let targetTeam
        switch(user.team.name) {
            case "ally": targetTeam = env.rpg.enemyTeam; break;
            case "enemy": targetTeam = env.rpg.allyTeam; break;
        }

        gakvuTalked = false

        let anim = env.ACTION_ANIMS.shoot
        for (let i = 0; i < 30; i++) {
            let baseDelay = ((env.ADVANCE_RATE * 0.1) * i)
            let animDelay = baseDelay + anim.duration;
            let validTargets = targetTeam.members.filter(member => member.state != "dead")
            if(validTargets) {
                let target = validTargets.sample()
                
                setTimeout(()=>anim.exec(this, user, target), baseDelay)
                setTimeout(()=>{
                    env.GENERIC_ACTIONS.singleTarget({
                        action: this, 
                        user, 
                        target,
                        hitSfx: { name: "fortniteShot" },
                        critSfx: { name: "fortniteShot" },
                        missSfx: { name: "shotMiss" },
                        critStatus: {
                            name: 'vulnerable',
                            length: 1
                        }
                    })

                    animElement.classList.add('scramble')
                    setTimeout(()=>animElement.classList.remove('scramble'), 100)
                    updateStats();	
                }, animDelay)
            }
        }

        if(env.combat.lastEngaged == 'archivecontainers')
            change('COMBAT!!ambushUsedGun', true)

        setTimeout(()=>{
            animElement.classList.remove('scramble')
            advanceTurn();
            ratween(env.bgm, initialRate)
        }, (env.ADVANCE_RATE * 0.1) * 30 + 500)
    }
}

env.ACTIONS.gakvu_mag_dump = {
    slug: "gakvu_mag_dump",
    name: "Mag Dump",
    type: 'special',
    desc: "'uses AR-15';'rapid attacks'",
    anim: "wobble",
    help: "x30 RANDOM ENEMY::100% -1HP 33%C -2HP +1T:VULNERABLE",
    usage: {
        act: "%USER OPEN FIRES",
    },
    accuracy: 1,
    crit: 0.33,
    amt: 1,
    exec: function(user, target) {
        let animElement = user.sprite || user.box
        let initialRate = env.bgm.rate()

        animElement.classList.add('aiming')
        ratween(env.bgm, initialRate + 0.5)
        play('ar15Click', 1, 1)

        let targetTeam
        switch(user.team.name) {
            case "ally": targetTeam = env.rpg.enemyTeam; break;
            case "enemy": targetTeam = env.rpg.allyTeam; break;
        }

        gakvuTalked = false

        let anim = env.ACTION_ANIMS.shoot
        for (let i = 0; i < 30; i++) {
            let baseDelay = ((env.ADVANCE_RATE * 0.1) * i)
            let animDelay = baseDelay + anim.duration;
            let validTargets = targetTeam.members.filter(member => member.state != "dead")
            if(validTargets) {
                let target = validTargets.sample()
                
                setTimeout(()=>anim.exec(this, user, target), baseDelay)
                setTimeout(()=>{
                    env.GENERIC_ACTIONS.singleTarget({
                        action: this, 
                        user, 
                        target,
                        hitSfx: { name: "ar15Shot" },
                        critSfx: { name: "ar15Shot" },
                        missSfx: { name: "shotMiss" },
                        critStatus: {
                            name: 'vulnerable',
                            length: 1
                        }
                    })

                    animElement.classList.add('scramble')
                    setTimeout(()=>animElement.classList.remove('scramble'), 100)
                    updateStats();	
                }, animDelay)
            }
        }

        setTimeout(()=>{
            animElement.classList.remove('aiming')                
            advanceTurn()
            ratween(env.bgm, initialRate)
        }, (env.ADVANCE_RATE * 0.1) * 30 + 500)
    }
}

env.ACTIONS.beer_splash = {
    slug: "beer_splash",
    name: "Beer Splash",
    type: 'support+target+self+autohit',
    desc: "'utilizes alcoholic beverage';'restore health';'heal over time';'cure puncture'",
    help: "AUTOHIT +2HP +3T:REGEN -PUNCTURE, 50%C +2HP",
    anim: "heal",
    usage: {
        act: "%USER SPLASHES %TARGET",
        crit: "%TARGET FEELS DRUNKER",
        hit: "%TARGET FEELS DRUNK",
        miss: "%USER MISSES"
    },
    crit: 0.5,
    amt: -2,
    autohit: true,
    exec: function(user, target) {
        return env.GENERIC_ACTIONS.singleTarget({
            beneficial: true,
            action: this, 
            user, 
            target,
            hitSfx: {
                name: 'beerSplash',
                rate: 1,
                volume: 3
            },
            hitStatus: {
                name: 'regen',
                length: 3
            },
        })
    }
}

// ITEM MODIFICATIONS
env.ITEM_LIST.sorry_cyst.name = "BSTRD CHAINZ"
env.ITEM_LIST.sorry_cyst.image = "https://file.garden/ZBykMtEMpVTUWZ-e/collapsefunnyassets/BSTRDCHAINS.png"
env.ITEM_LIST.sorry_cyst.description = "'chains from the golem we beat up';'very cool';'<span style='color: var(--bastard-color) !important; font-family: bastard;font-size: 3em;line-height: 1.5em;'>sick ass fukin CHAINZ</span>'"

env.ITEM_LIST.restorative.name = "BAND-AID®"
env.ITEM_LIST.restorative.image = "https://file.garden/ZBykMtEMpVTUWZ-e/collapsefunnyassets/bandaids.png"
env.ITEM_LIST.restorative.description = "'quick-acting corrucystic cloth adhesive';'best used for fractures away from danger';'quick patch'"

env.ITEM_LIST.satik_cyst.name = "mini-shield pot"
env.ITEM_LIST.satik_cyst.image = "https://file.garden/ZBykMtEMpVTUWZ-e/collapsefunnyassets/shieldpot.png"
env.ITEM_LIST.satik_cyst.description = "'contains rapid ablative barrier applicators';'shorthand for fortnite item ,,Small Shield Potion,,';'drink in case of emergency'"

env.ITEM_LIST.aima_cyst.name = "aim assist"
env.ITEM_LIST.aima_cyst.image = "https://file.garden/ZBykMtEMpVTUWZ-e/collapsefunnyassets/aim-assists.png"
env.ITEM_LIST.aima_cyst.description = "'perception-enhancing targeting device';'traditional gaming implement';'useful for pwning'"


// REACTION MODIFICATIONS
env.COMBAT_ACTORS.akizet.reactions = {
    evade: ["evaded!", "evaded!", "evaded!", "you couldnt hit water if you fell out of a boat", "try again bud", "try again bud", "try again bud"],
    crit: [ ()=>env.combat.has('husk') ? "GET AWAY" : "BLAM" ],
    crit_buff: [ ()=>env.combat.has('husk') ? "DIE" : "ez!"],
    miss: ["FUCK", "SHIT", "THIS IS ASS"],
    dead: ["avenge mee...."],
    receive_hit: ["OW!"],
    receive_crit: ["SHIT!!"],
    receive_puncture: ["ah! reminds me of heroin", "this feels familiar"],
    receive_buff: ["thanks", "we will triumph"],
    receive_destabilized: ["woaah is this what weed feels like", "im gonna throw up......"],
    receive_rez: ["back from the dead baby"],
    puncture: ["I NEEEED A MEDIC BAG", 
        ()=>env.combat.has('tozik') ? "TOZIK" : "DOC CMON MAN",
        ()=>env.combat.has('cavik') ? "CAVIK" : "band aid®s PLEASE" 
    ],
    regen: ["better than ever", "mmmm health"],
    destabilized: ["so high..."],
    stun: ["NO.. MHY TURN..."],
    receive_carapace: ["for free??!?!", "so awesome"],
    receive_repairs: ["thank you, cavik", "better !"],
    receive_fear: ["NO, NO...", "AAAAARRG...", "velzie spare me.."],
    receive_redirection: ["thats right tank it", "final death in 10...", "i can take it thank you very much"],
}

env.COMBAT_ACTORS.gakvu.reactions = {
    evade: [
        ()=>env.combat.has('husk') ? "AAAAHHH!" : "haha!",
        ()=>env.combat.has('husk') ? "dont touch me!!" : "woaAOAOOAAaah!!",
    ],
    crit: [
        ()=>env.combat.has('husk') ? "clean cut!" : "it is simply that easy",
        ()=>env.combat.has('husk') ? "waiter! waiter! a few more like that please!" : "im sooo lucky"
    ],
    crit_buff: ["so that goes this way..."],
    miss: [
        ()=>env.combat.has('husk') ? "ah SHIT!!" : "oh... man",
        ()=>env.combat.has('husk') ? "it is simply too fast!!" : "whoops!",
        "...or so ive been told"
    ],
    dead: ["..."],
    receive_crit: ["gah!!!"],
    receive_puncture: ["i am... sludgifying...?", "eeyah!!! what the flip..."],
    receive_buff: ["thaaaaanks bestieee"],
    receive_destabilized: ["velzie this isnt what you think it is"],
    receive_rez: [
        ()=>env.combat.has('husk') ? "thank you sooo much" : "MY SAVIOR...",
    ],
    puncture: ["im bleedin!!", "Ough."],
    regen: [
        ()=>env.combat.has('husk') ? "feeling ok" : "feelin good!",
    ],
    destabilized: ["........."],
    stun: ["my glasses.. where did they GO?!"],
    receive_carapace: ["so obese"],
    receive_repairs: ["thaaaanks caveek"],
    receive_fear: ["stop looking at me youre WEIRD!!", "get away from me!", "NO.. NO NO NO NO NO", "huh? what?? speak up"],
    receive_redirection: ["bozko?? youd do it.. for me???"],
}

env.COMBAT_ACTORS.tozik.reactions = {
    crit: [
        ()=>check('PAGE!!barfriend', true) ? "heHAhEhaEHAHAheh" : "eh good enough",
        ()=>check('PAGE!!barfriend', true)  ? "y-hic.. yeah..!" : "oooh good one me",
    ],
    crit_buff: [()=>check('PAGE!!barfriend', true)  ? "keep.. go-hic. goinh..." : "thats right keep going"],
    dead: [()=>check('PAGE!!barfriend', true) ? "arg.." : "uff."],
    receive_destabilized: [()=>check('PAGE!!barfriend', true) ? "i.. hic. heer... call" : "i hear it calling"],
    receive_rez: [()=>check('PAGE!!barfriend', true) ? "wha..? wher.. am i..." : "LETS FINISH THIS."],
    puncture: [()=>check('PAGE!!barfriend', true) ? "aAAgrggh.." : "this will need a patch"],
    destabilized: [()=>check('PAGE!!barfriend', true) ? "..." : "(silent praying)"],
    stun: [()=>check('PAGE!!barfriend', true) ? "ca-hic. cant see..." : "where... am i"],
    receive_carapace: [()=>check('PAGE!!barfriend', true) ? "th.. thannnkss..." : "thank you"],
    receive_repairs: [()=>check('PAGE!!barfriend', true) ? "bettur.." : "now thats better"],
    receive_fear: [()=>check('PAGE!!barfriend', true) ? "st.. stop..." : "stop trippin",
    ()=>check('PAGE!!barfriend', true) ? "hh.. how..." : "and yet it got the moves",
    ()=>check('PAGE!!barfriend', true) ? "who... hic-hurrrt youuu..?" : "who hurt you?",
    ()=>check('PAGE!!barfriend', true) ? "i.. i canf..." : "NO.. THAT CANT BE...",
    ()=>check('PAGE!!barfriend', true) ? "hrrg... urk..!" : "(mumbl mumble)"],
    receive_redirection: [()=>check('PAGE!!barfriend', true) ? "no... m-hic. me. i.. can take..." : "i too can take hits, ladies and gents get me instead"],
}

env.COMBAT_ACTORS.miltza.reactions = {
    evade: [
        ()=>env.combat.has('husk') ? "waahh!!!!" : "i did it.. i did it!!",
    ],
    crit: ["die!! kill yourself!!"],
    crit_buff: ["is that better??"],
    miss: [
        ()=>env.combat.has('husk') ? "how does it have the moves?!" : "we will get em next time",
    ],
    dead: ["Dead. Not big surprise."],
    receive_crit: ["AAAH SHIT!!"],
    receive_puncture: ["band aids band aids!! BAND AIDSS!!!", "medic medic!! MEDIC!!! MEDIC!!!!"],
    receive_buff: ["thank you for the win!"],
    receive_destabilized: ["die DIE!! DIE!! DIE!!! DIE!!!!!!!", "blocking them wasnt enough i want them SLUDGED"],
    puncture: ["i am losing!"],
    stun: ["oaaBZZRRZuuuRRZZTTauRRRTTTT"],
    receive_carapace: ["uber!!"],
    receive_repairs: ["thank you, thank you!", "aaaahhh... much better"],
    receive_fear: ["that one just like me...!", "stop...", "velzie kidnap me", "stay away! away!!"],
    receive_redirection: ["what? red fabric??", "watch this simple trick"],
}

////////// DIALOGUE //////////
env.dialogues["genericenemy"] = generateDialogueObject(`
start
    sourceless
        WE ARE BESET BY INCOHERENT FOES
            EXEC::forceSwapCam(true)
        OUR ONLY OPTION IS TO FIGHT...

____SHOWIF::'EXEC::checkItem(env.ITEM_LIST.disabler)'
        OR IS IT?
        WE COULD ALSO EXPEND THE DISABLER
        THERE MAY BE A BETTER TIME FOR IT LATER...
____END

    RESPONSES::akizet
        engage<+>END
            SHOWIF::['gameplay_off', false]
            FAKEEND::(begin combat)
            EXEC::env.combat.dynamicCombat({exec: env.embassy.randomBgmTime})
        bypass<+>END
            SHOWIF::['gameplay_off', true]
            FAKEEND::(bypass combat)
            EXEC::env.combat.dynamicCombat({dry: true});cutscene(true);setTimeout(()=>{cutscene(false);env.combat.dynamicCallback(env.rpg.enemyTeam)}, 1010)
        disable<+>disable
            SHOWIF::'EXEC::checkItem(env.ITEM_LIST.disabler)'
            FAKEEND::(use disabler charge)
        debug kill<+>disable
            SHOWIF::'TEMP!!debug'
            FAKEEND::(use disabler charge)

disable
    sourceless
        I CAREFULLY LINE UP THE DISABLER
            EXEC::removeItem(env.ITEM_LIST.disabler);
        AND WITH AN IMPULSE THROUGH MY HAND, A NUMBER OF SPECIALIZED SPINES ARE PROJECTED VIOLENTLY OUTWARDS
        THEY NEEDLE OUR FOES, AND IN SECONDS, THEY HAVE STARTED TO MELT
            EXEC::setTimeout(()=>play('shot2', 0.6), 300)
    RESPONSES::akizet
        continue<+>END
            EXEC::env.combat.dynamicCombat({dry: true});cutscene(true);setTimeout(()=>{cutscene(false);env.combat.dynamicCallback(env.rpg.enemyTeam)}, 1010)
            FAKEEND::(wait)
`)

env.dialogues["genericenemyvictory"] = generateDialogueObject(`
start
____SHOWIF::'gameplay_off'
    sys
        ATTENTION::"thoughtform combat gameplay bypassed";'toggle within system menu if desired'
____END

    sourceless
        OUR FOES LAY DESTROYED
        TEXEC::env.combat.dynamicReward()

    RESPONSES::akizet
        continue<+>END
            EXEC::forceSwapCam(false)
`)

env.dialogues["loss"] = generateDialogueObject(`
start
    sourceless
        A SHARP LIMB STRIKES MY MINDCORE
        ...
            EXEC::content.classList.add('goodbye');ratween(env.bgm, 0.2, 10000);content.classList.add('dying');
        WHAT IS HAPPENING
        EVERYTHING HAS STOPPED
        HELLO?
        TOZIK? GAKVU??
        FUNFRIEND?
        IS ANYONE THERE?
        HELP

    unknown
        ...
            SHOWONCE::

    sys
        ALERT::"recollection locus destroyed";"iteration unable to continue"
        ADVISE::"start new iteration";"load saved iteration"
            SHOWIF::'collapseSave'
        ADVISE::"start new iteration"
            SHOWIF::['collapseSave', false]

    RESPONSES::sys
        return to selection<+>END
            EXEC::moveTo("/local/ocean/embassy/")
`)


/************** INTRO AND PERSONNEL **************/
env.dialogues["gol_intro"] = generateDialogueObject(`
RESPOBJ::
    RESPONSES::akizet
        the plan<+>plan
            
        wait<+>wait
            SHOWIF::'gol__intro-plan'
            EXEC::vn.done()
            FAKEEND::(end preparations)
    
    RESPONSES::itzil
        kivii<+>kivii
    
    RESPONSES::miltza
        hesitance<+>hesitance
            SHOWIF::'gol__intro-plan'

    RESPONSES::karik
        sfer<+>sfer
            SHOWIF::[["PAGE!!karikfed", false]]
`)

env.dialogues["intro"] = generateDialogueObject(`
loop
    RESPOBJ::gol_intro

start
    sys
        ATTENTION::'continuing memory stream'
        NOTE::'inheriting iteration context'
        
    RESPONSES::sys
        continue<+>continue
        skip<+>END
            SHOWIF::"gol__intro-end"
            EXEC::vn.done();
            FAKEEND::(skip sequence)

continue
    movefriend
        ok gakvukani
        commencing relocation!
    
    sourceless
        the descent begins, though it is terribly unsteady
        was that something knocking against the underside of the chamber?
        movefriend does not get far before it slows to a halt again

    movefriend
        wow!!
        friends: please forgive the turbulence!
        <span definition="INHERITED CONTEXT::'aqueous low-activity corru';'occupies space between cystic organs';'terrestrial use only'">corroyi</span> density is unusually high in this area
        in fact, all standard currents have ceased!
        but do not worry!! i can still get you where you need to go!
    
    akizet
        what does that mean for the spire?

    sourceless
        i feel the chamber's ground shift beneath us, pulling outwards
        ah... it is forming limbs outside of the chamber
        indeed, it must physically crawl through the spireblood and drag the chamber with it
        an extremely strenuous process, i suspect
    
    movefriend
        i must focus on the locomotion sorry!!
        please ask the constructor within the chamber!

    sourceless
        i look towards tozik at first
        he looks back at me absently, then makes an uncertain gesture with his receptors
        before i can ask it to clarify, one of the mindcores announces themselves
    
    karik
        that is me!!
            EXEC::vnp({karik:"show", bg: true})
        
    sourceless
        i sense some surprise between the ekiviks
        that would be a little funny, if not for the circumstances
        their kiv rarely take part directly in structural management
    
    karik
        if the corroyi is no longer correctly distributed across the spire,
        then that means it is going to be pooling at the lower levels...
        and grow more dense as the layers separate, until, ah...
        well, the lower levels will be crushed by the pressure
        and then the spire's outer walls will explode
        as you imagine, my friends, this is not conducive to our goals

    gakvu
        the groundsmind would be destroyed, but so would the explanation for all of this...
            EXEC::vnp({gakvu:"showright"})
    
    tozik
        along with any would-be survivors
            EXEC::vnp({tozik:"showright"})
    
    karik
        exactly...
        there is a solution to this, but we require groundsmind control
        it seems that the perpetrator is not properly attending to the structure's systems
    
    miltza
        do you expect us to be able to get there in time?
            EXEC::vnp({gakvu:"hide", tozik: 'hide', miltza: 'showleft'})
        the groundsmindry is at the lowest portion of the spire...

    karik
        well...
            EXEC::vnp({miltza: 'hide'})
        i will say our chances are not ideal
        but what else can we do?
    
    sourceless
        i sense a spark of inspiration from tozik, 
        even reflected in his receptors...
        but he does not yet speak up, ever hesitant to share an unfinished thought
        while we wait for the movefriend to deliver us to golem maintenance,
        a plan should be devised
        ...and we should get a profile of itzil's kivii

    RESPONSES::akizet
        what to ask first...<+>loop
            EXEC::vnp({karik: "hide", bg: false})

plan
    sourceless
        in the near silent tension of our descent, 
        i feel that our lack of a clear plan is causing even more anxiety
        all are in thought, though itzil is pacing
        so i speak up with what i know:
    
    akizet
        my friends, the time is coming
        we should align our paths

    sourceless
        i briefly pause to garner their collective attention, then continue,
            EXEC::vnp({miltza: "show far", gakvu: "show far", tozik: "show far", karik: "show far", itzil: "show far", hideStage:true})

    akizet
        i am unfamiliar with the layout of the golem maintenance segment, but itzil, you know it well, yes?
    
    sourceless
        itzil ceases their endless skittering to nervously wave their receptors
    
    itzil
        oh, yes!! even better than my home!
    
    akizet
        excellent, then tell me if any of this seems unreasonable:
        when we arrive, we should immediately find ways to arm ourselves
        assuming the foundry vats are still operational, we need only find some schematics
        next, we should probably find a body for--
    
    tozik
        akizet, if the structure fails, then this will not yield us any gain
    
    sourceless
        IMMEDIATELY, THE MORALE I WAS ATTEMPTING TO BUILD IS CRUSHED
        THERE IS THAT PANG OF FEAR AGAIN - THOUGH THIS TIME, IT IS MINE
        THE POSSIBILITY OF US ALL UNCEREMONIOUSLY DYING ON OUR WAY
        COMPLETELY OUT OF OUR CONTROL, REALLY...

    akizet
        ...yes, tozik, i know, but--
    
    tozik
        no no, you see, i have an idea
            EXEC::vnp({tozik: "focus far"})
        i was here recently while giving advice on the design of the deep-sea constructor golems
        it was in the distribution area of the manufacturing tendril that i saw something unusual...
        for quick deployment, they have their own groundsmindry override
        there was a jut using it to directly release golems to the exterior of the spire
    
    itzil
        aah!!! of course!!
            EXEC::vnp({tozik: "defocus far"})
        it is only a small range in which it is effective, but...
        that could be just enough to delay total collapse!!
        do you think that would work, karik?

    karik
        oh yes, oh yes
        by releasing some of the pressure, that should buy us some time
    
    sourceless
        ah, and so he shapes the morale back up, though in a different design
    
    miltza
        we could use that to evacuate any survivors we find!
        it can form tunnels to the outside, yes?
    
    sourceless
        the way miltza stands and fidgets...
        if a tunnel opened, she would scramble through it without any thought
        the very same fear as in fresh surface runners
        cowardice, perhaps, but i cannot truly blame her
        a remote coordinator does not simply change expertise for fun
    
    tozik
        if we must, i suppose
        but we will need all the help we can get if we intend to assault the groundsmind

    gakvu
        what if i expand the control of the override?
    
    sourceless
        in a brief stunned silence, our attention is drawn towards gakvu
        how many unauthorized miracles does she know how to perform?
        groundsmindry overrides are tightly controlled, but...
        she is clearly capable of more than i have ever known
    
    miltza
        how could you possibly do that?
            EXEC::vnp({tozik: "hide", karik: "hide", itzil: "hide", miltza: "", gakvu: ""})
        in fact - <em>how</em> have you been doing any of this?
            EXEC::vnp({miltza: "focus"})
        it is so convenient that you can guide us through the impossible as you have been
    
    sourceless
        miltza's voice is heavy with accusation, her receptors closed like fists
        an outburst simply driven by fear, but...
        what is she implying...?
        itzil skitters forth, announced by the clicking of their sharp legs against the cystic glass
    
    itzil
        hey! does it matter??
            EXEC::vnp({miltza: "defocus far", gakvu: "far", itzil: "show far"})
        gakvu is helping us save everyone!

    sourceless
        itzil's assertion earns miltza's attention, for she seems to have no retort
        but this alone is not enough to defuse her suspicions
        gakvu hangs her receptors back cynically
        she could elect not to even answer, but...

    gakvu
        all right, if you want a proper explanation, then fine
            EXEC::vnp({miltza: "", gakvu: "focus", itzil: "hide"})
        yes, i have a mindcore with groundsmindry capabilities
        ah, what can i say
        i am quite attached to it

    sourceless
        where is this spite coming from?
        the briefest silence passes, miltza looking between us
        she seems to take particular interest in tozik in this moment

    miltza
        is this issue only mine?
            EXEC::vnp({miltza: "", gakvu: "defocus"})
        our tools and golems usurped, and here before us is a cynical vel with that very ability?
        is your groundsmindry destination truly to help us?
    
    sourceless
        miltza reaches a peak, and tozik eyes me
            EXEC::vnp({tozik: "show downright"})
        itzil backs off to the corner with karik, their eye drifting with concern now
        i will admit, this coincidence did not even occur to me... it is suspicious
        but it is without roots - gakvu would never intend us harm 
        yes, i should intervene
            EXEC::vnp({tozik: "hide"})
    
    akizet
        miltza...
            EXEC::vnp({miltza: "focus"})

    sourceless
        she pauses and gazes at me, her receptors slightly releasing from their fist-like clench

    akizet
        i have worked with gakvu long enough to know,
        she could not be doing this
        in fact, the terror i felt from her when she was first attacked...
        no, she could not be a perpetrator
        but... it is still unusual, this is true

    sourceless
        then, i turn to gakvu, disappointed in her unhelpful handling of the situation
        she seemed proud of herself with her little joke, but now i see apologetic shame
        her tone softens to explain,
    
    gakvu
        ...yes, i know how it looks
            EXEC::vnp({miltza: "defocus"})
        the truth is complex
        miltza, you must trust that i am here to help
        i can explain everything later
        but we have to get out of here intact, first
    
    sourceless
        i see a wordless agreement as miltza's receptors lose their tension
        though they do not stray near one another, they have an accord... for now
    
    akizet
        ...ok
        to return to our path,
        top priority: use the override in manufacturing to stop the structure from collapsing
        next: arm ourselves - in fact, if we can make more timestopper connectors, even better
        also, we should find suitable bodies for itzil and karik
        then: find any survivors, itzil's kivii included
        finally, we descend to the groundsmind, and cease this madness
        all right?
    
    itzil
        sounds good!!
    
    sourceless
        the others agree with a simple forward waving of their receptors
    
    akizet
        excellent

    RESPONSES::akizet
        what else...<+>loop
            EXEC::vnp({miltza: "hide", gakvu: "hide", hideStage: false})

kivii
    akizet
        itzil!
            EXEC::vnp({itzil: "show"})
        tell me about your kivii
        their name, their receptors, where you think they may be...
        anything will help
    
    sourceless
        ah...
        as i said that, i felt a murmur of my larval life, searching for missing runners
        i may have said those exact words before
        velzie's fondness for repetition is truly nauseating
    
    itzil
        oh, ok!
        well, her name is dozkallvi kiv gediziki, and she styles herself with a broken receptor!
        she is ok, of course, it is just a strange styling, hehehe
        i do not know which area she would be in, specifically...
        you see, she was covering for me while i reconnected with some family over the collective
        she does not really enjoy the company of my family very much, and, ah, i do not blame her,
        they were never really happy with me finding a mate from another cave-city, you see...
    
    sourceless
        itzil trails off after seeing the look upon my face and receptors
        am i too flat? should i be more interested in their romance?
    
    itzil
        ah, umm, right--i was going to say, i do not know which area she would be in
        she was simply a substitute for my hands for the gaze
        so, wherever you may find a kiv, i think! 
        they probably had her in manufacturing!

    akizet
        i see, thank you
        we will find her, itzil

    RESPONSES::akizet
        what else...<+>loop
            EXEC::vnp({itzil: "hide"})
    
sfer
    akizet
        karik!
            EXEC::vnp({karik: "show"})
        did you mention earlier that your sfer reserves were low?
    
    sourceless
        i am still unsure if i should crouch while speaking to the mindcores...
        but it seems kinder than looming over them

    karik
        yes, i did!
        i know repairing movefriend came first, but...
        if there is any left, i would not protest!

    akizet
        there is a little, do not worry!

    sourceless
        i draw a cube of sfer from our stash,
        and simply set it beside karik
        because... though the thought occurred to me,
        feeding them directly would be so strange
        thankfully, karik does not seem to mind

    karik
        thank you, akizet!

    sourceless
        they coil an emergency leg around the sfer and press it against their side
        their shell extends to envelop it and draw it inward

    karik
        ahh, that is much better
        i appreciate your efforts, my friend!

    RESPONSES::akizet
        of course<+>loop
            EXEC::vnp({karik: "hide"});change("PAGE!!karikfed", true)

hesitance
    akizet
        miltza
            EXEC::vnp({miltza: "show far"})
    
    miltza
        ah, akizet, hello!
        sorry...
    
    sourceless
        at once, it seems she may launch into an apology, gesturing even with her third arm
        but i simply wave the notion away with my receptors
        she seems more at ease with my acceptance
    
    akizet
        at this point, there are no laws binding us anymore
        the only thing that matters is survival
        can i trust that you will stand with us against whatever awaits?
    
    miltza
        yes, of course...
    
    sourceless
        gakvu pretends to be uninterested in our conversation
        the room is too small for any secrets
    
    miltza
        but let me say, there is a reason ekiva frowns upon mobile groundsmindry
            EXEC::vnp({miltza: "show"})
        i never much cared for structurism, but the anti-structurists were a sour option themselves
        they used illegal groundsmindry to sow chaos anonymously
        i mean, that is all a flicker in the past now, but... the flame is carried into death still
        this could be a coordinated attack, not just by one person, but many
        still, if you can trust gakvu, i will trust her too
        ...
        in these times, we must, despite whatever may hang over us
    
    sourceless
        what a strange turn of phrase - she certainly means culturally
        but there is something in her tone...
        i feel a certain weight to it - has her larval history affected her so severely?
        or... is she within the greater conflict herself?
        despite her flightiness and her outburst, i feel i can trust her
        yes, she must simply be scared beyond her limits
        remote coordinators like her rarely saw any direct action,
        only ever experiencing the terror of the surface through their distant eyes
        but it seems that terror has found her, now
        final death has never been closer to all of us

    RESPONSES::akizet
        true...<+>loop
            EXEC::vnp({miltza: "hide"})

wait
    sourceless
        with my curiosities sated, we wait
        the remaining sfer we collected is distributed amongst ourselves
        to mend wounds, attempt repairs to inner components, so on
        and there is some small chat here and there, but in time, our progress slows
        to a worrying degree, in fact... the corroyi no longer murmurs past the walls as it did
    
    movefriend
        ok friends! good news!
        the density is so high i was not able to get you to the usual entry point
        in fact, the entire segment is surrounded by dangerously dense corroyi!
        sorry!! that was not the good news yet! here it is!
        we are near one of the personnel tendrils of the golem maintenance segment!
        it seems to have sunken and partially collapsed from the damage...
        but it is still attached to the main area!
        i can connect you there, but until the corroyi flows are restored,
        that is the best i can do!
    
    itzil
        oh... my room...
            EXEC::vnp({itzil: "showright far"})

    gakvu
        how will we get around without a movefriend?
            EXEC::vnp({gakvu: "showleft focus"})
        i was able to help before, but... that is not sustainable
        especially not if the density is going to be very high
    
    itzil
        ...oh!!
            EXEC::vnp({gakvu: "defocus"})
        gakvu! the entire floor is connected! it is not like your segment at all
        or most of them, really...
        all of the tendrils and chambers are connected semi-permanently
        it is easier to move golems and resources around that way!

    tozik
        yes, this was impressed upon me in my recent visit
            EXEC::vnp({tozik: "showleft far"})
        it was as if i were strolling through a vaznian cavern

    karik
        ahh, in that case...
            EXEC::vnp({tozik: "hide", itzil: "hide", karik: "show far"})
        even with the high density, it should still be mostly intact
        contiguous spire chambers are typically well reinforced, for they do not move often

    movefriend
        yes yes very good structure!
            EXEC::vnp({gakvu: "hide", karik: "hide", bg: false})
        however it will not last forever!
        archival veins around the segment are collapsing and will soon be falling into the area directly
        be careful friends! i will wait here for when you return!
    
    akizet
        are you able to handle the corroyi pressure here?
    
    movefriend
        umm no sorry!!
        once it is safe for all of you to leave me, i will return to a safe level until you have resolved the pressure problem!
    
    miltza
        you are leaving us??
    
    movefriend
        oh no no no!
        only a little!
        i will be back to deliver you to the groundsmindry floor, of course!
        and if you take too long,
        ...
        nevermind!
        good luck!
    
    sourceless
        movefriend forms a tunnel to the personnel tendril, 
        though it remains partially closed until we are ready to proceed
        but before then, i should consider...
        who do i want to accompany me? 
        miltza has proven to be a powerful defensive force, despite her hesitance
        tozik, i think, we will need for his repair skills...
        but gakvu's control over corru is uniquely effective
        hmm...

    sys
        NOTICE::'PARTY MENU';'attached to SPATIAL NAVIGATION';'associated with letter Z'
        NOTICE::'additional functionality enabled'
        NOTICE::'activate or deactivate potential party members';'drag from or into active party'
        NOTICE::'recollective locus cannot be removed from party'

    RESPONSES::akizet
        velzie be kind<+>END
            EXEC::vn.done()
`)

/* personnel intro */
env.dialogues["personnel"] = generateDialogueObject(`
start
    sourceless
        we advance to the personnel tendril, those of us with timestopper connectors at the front
        movefriend's tunnel slowly becomes crooked as it adjusts to the uneven tendril
        the corru walls take the form of false cave-stone, just like our recreation chamber
        and so the terrible brutality before us is like a vision of the past...
        but it is here now, a failed barricade given way to invasion
        and it is silent, without sign of foe
        the qou here are dissected, mindcores half-dissolved in their bled components
        the others avert their eyes after a quick scan, but i find myself staring
        why are their bodies so intact? why such precision?
        regardless - i do not see any sign of itzil's kivii, these are jut and vel
    
    akizet
        just keep moving
    
    sourceless
        i gesture for the mindcores to climb up along the walls and ceiling, as it will be safer
    
    sourceless quiet
        then, a step into our advance, a familiar whisper comes again...
            EXEC::changeBgm(env.embassy.music_signal, {length: 10000, seek: 0});
        we exchange a few glances, tozik's receptors at attention
        he speaks flatly, dreadfully
            EXEC::content.classList.add('painprep', 'painhalf')

    tozik
        it is happening again
    
    sourceless
        that is all the time we have to brace ourselves

    sourceless quiet
        the signal, the pain, it is here
            EXEC::env.embassy.day3Signal(3000)
        the wordless message, breathed again
        it feels stronger, but we still stand--are we more resilient?
        i can think this time... i can feel that the pain is not mine
        i manage to stay standing against a wall, and the others stumble, clutch their heads, their chests...
        my eyes bend, my sense of gravity is disrupted... but i stay conscious
            EXEC::ratween(env.bgm, 1, 2000)

    karik
        <em>what</em> is happening again?
    
    itzil
        hey!! are you ok?!
    
    sourceless quiet
        what...
        i see through the pain, the mindcores plainly looking down upon us from the ceiling
        are they... not affected...?
        the signal is short-lived this time, like an echo of itself - already, it abates
        my eyes slowly recover, though i feel my perception is still not entirely accurate
        but before i can say anything, there is a rustling throughout the room
            EXEC::content.classList.add('painfade')
        the slain qou... some have risen
            EXEC::vnp({husk1:"show far", bg: true})
        their bodies distorted by their damage, as if drawn to <span definition="INHERITED CONTEXT:'parasite';'reanimation'">terrible life</span> by secri
            EXEC::vnp({husk2:"show far", hideStage: true})
    
    miltza
        is that... 
    
    sourceless
        ŸÆkf
        it is not an illusion
        they are real, and they walk towards us with the strangest serenity
    
    aggressor
        here
        i am here
            EXEC::content.classList.add('slowpain');
        i am here
            EXEC::content.classList.remove('painmode', 'painhalf', 'painfade');vnp({husk2:"show", bg: true})

    sourceless
        they speak in unison, each unique voice blending into one another
        a droning metallic chorus, filling the tendril
        at first, with each step towards us, we back away, uncertain
        to kill an aberrant container is simple, but...
        do these ones intend us harm? or is it more? can they be helped?
        i step forward
    
    akizet
        hello?

    aggressor
        here
        i hê’ˆ³ar you
        i hear you
        usurpers
            EXEC::content.classList.remove('painprep')
    
    gakvu
        akizet... stay back
        those are not obesk!!
    
    sourceless
        her fear conveys what i need to know
        they are not miraculous survivors, they are infested husks
        we must make the first move
    
    RESPONSES::akizet
        attack!!<+>END
            EXEC::change("PAGE!!gp", true);env.embassy.startGolemFight('g_prelobby1', 'personnel_clear');vn.done()
            SHOWIF::['gameplay_off', false]
            FAKEEND::(initiate combat)
        bypass<+>CHANGE::personnel_clear
            SHOWIF::['gameplay_off', true]
            FAKEEND::(bypass combat)
            EXEC::change("PAGE!!gp", true);vn.done()
        skip (debug)<+>CHANGE::personnel_clear
            SHOWIF::'TEMP!!debug'
            EXEC::vn.done()
`)

/* personnel postfight */
env.dialogues["personnel_clear"] = generateDialogueObject(`
start
____SHOWIF::'gameplay_off'
    sys
        ATTENTION::"thoughtform combat gameplay bypassed";'toggle within system menu if desired'
____END

    sourceless
        the last husk crumbles into itself
        immediately, i scan over our team, and we are fine enough
            EXEC::changeBgm(env.embassy.music_unsafe_golems)
        itzil and karik cling to the ceiling in the corners, itzil refusing to look
        miltza and gakvu both have recoiled in our victory with no celebration
        tozik, most of all, seems present in this moment with me, drawn to one of the corpses
        the adrenaline, the subtle joy i felt before, is overwhelmed by grief
        i did not know these qou, but in their incoherent faces were every person i have ever spoken kindly to
        ...
    
    tozik
        these... 
    
    sourceless
        he nearly addresses them as qou, but thinks better of it as his voice shakes into a pause
    
    tozik
        ...they have no mark of control,
        no sigil or connector
        no mindcore...
        how is this even possible?
        our bodies are too complex even for regular groundsmindry
    
    sourceless
        these bodies are all truly uninhabited?
        the mindcores, itzil, karik... maybe they could...
        no, no - a terrible thought, i dare not even complete it
        but that does bring something to mind
    
    akizet
        hey
        itzil, karik
        did you not feel the signal a moment ago?
        the same one as before? the pain, the madness

    sourceless
        they look at one another, though itzil returns to huddling in the corner, eyespot turned away
    
    karik
        ...no!
        i mean, i felt something...
        but it... it just passed
        it was not like before
    
    akizet
        gakvu, miltza, you felt it?
    
    sourceless
        a simple affirmative receptor gesture from both is all they can muster for now
        tozik stands from the body he examined, drawing his corruskivi back beneath the surface of his hand
    
    tozik
        i did, too...
        it felt closer
        we are on the right path
    
    sourceless
        his finality implies we should leave this tendril sooner rather than later, so we commence
        but still... closer is a good way to put it
        it felt stronger, but it may just be proximity
    
    akizet
        itzil, karik
        remain close
        stay high and far away from any bodies or inactive golems
    
    itzil
        ok akizet!
    
    RESPONSES::akizet
        continue<+>END
`)

/************** LOBBY */
/************** LOBBY */
/************** LOBBY */
/* 
    After they proceed through the personnel tunnel
*/
env.dialogues["lobby_danger"] = generateDialogueObject(`
start
    sourceless
        Ìw?¤eÔ!!!
            EXEC::pauseSwapCam(true)
        they are here, too, and are drawn to us immediately
        it was not a single moment of madness
        velzie's eye hangs heavily over us, i feel its delight in our torment
        these husks must be destroyed before the others can come through

    RESPONSES::akizet
        continue<+>END
            EXEC::change("PAGE!!gl", true);pauseSwapCam(false)
`)

/* 
    when the lobby is clear, akizet notes that the other doors seem to be sealed 
    so she calls in the rest of the team and gelitime beginnes
*/
env.dialogues["lobby_clear"] = generateDialogueObject(`
start
    sourceless
        with the area clear, i also notice the doors here are sealed
            EXEC::content.classList.add("safe");
        it is safe enough, so i call back
            EXEC::changeBgm(env.embassy.music_golems)
    
    akizet
        it is safe to proceed! come, quickly!
    
    sourceless
        and so we stand in this great lobby, where i imagine movefriend first tried to deliver us
        the stone, the decorations of false life...
        were it not for the splattered corroyi and sludge from our once-friends, it would be beautiful
    
    akizet
        itzil, where is maintenance from here?
            EXEC::vnp({bg: true, itzil: "show far"})
    
    sourceless
        itzil scurries towards me, then... past me?
        they approach the central desk, which seems to have a managerial golem stationed at it
            EXEC::vnp({hideStage: true, itzil: "show far", geli: "show far"})
        it is inactive, i did not even notice it at first
        uncanny... it resembles a qou more than a golem
    
    itzil
        geli? geli?
        sorry akizet - i will answer you, but i must see...
    
    sourceless
        itzil climbs up onto the golem's shoulder, then extends a branched receptor towards its head
            EXEC::vnp({itzil: "show", geli: "show"})
        tozik steps forward, reaching out in objection
            EXEC::vnp({tozik: "showleft downleft"})
    
    tozik
        itzil--
        you should not take any chances with--
    
    sourceless
        of course, it is too late, as itzil has already connected to it
            EXEC::env.embassy.geliState('boot');vnp({tozik: "hide"})
        in an instant, the golem's face flickers to life, its glow restored
        then comes the rest of its body...
            EXEC::env.embassy.geliState('on')
        it looks down at the mindcore on its shoulder, away from us
            EXEC::document.querySelectorAll('.geli').forEach(el=> el.classList.remove('inactive'))
    
    geli
        hello, itzil
        what are you doing here? i thought you took the gaze off
    
    sourceless
        its voice is feminine, shifting between intonations strangely as golems tend to
        when itzil disconnects, geli looks towards us, pseudoreceptors extending in greeting
        itzil seems all right, though they are looking at geli strangely...
        perhaps with an engineer's eye, assessing the damage?
        though, this is interesting--it sprouted disconnected receptors
        the physical marking of an echo with life-like personality
        it is likely bearing a strong echo of a tir in the embassy, or perhaps one carried from home
    
    geli::happy
        oh! welcome! you are all from another division?

    geli
        if you were hoping to use the...

    geli::uncanny
        the...
    
    sourceless
        geli's eyes drift around, scanning over the carnage, the damaged ceiling and walls...
        then, it seems to stare at me with the strangest expression of bafflement
        or--through me? i move out of the way, but it stares at me still
        then i check over my shoulder with a spin of my head, 
        but when i look back at the golem, it now looks at me, not like before
    
    geli
        ...i see...
    
    itzil
        geli! oh you are ok!!
        can you help us? there is an emergency
        everything is going crazy!
    
    sourceless
        itzil scurries down onto the desk to speak with the golem
        geli smiles like a bright cousin, dipping its head respectfully
        a strange behavior to assign to a golem...
        i suspect they wanted the qou here to practice smiling in case of public appearance
    
    geli
        i will do what i can
        what do you need?
    
    sourceless
        the doors all seem to be locked...
        maybe this golem can help us through

    RESPONSES::akizet
        interrogate<+>CHANGE::geli_first
            EXEC::vnp({hideStage: true, itzil: "hide"});pauseSwapCam(false)
            HIDEREAD::
        look around more first<+>END
            EXEC::vn.done();pauseSwapCam(false)
`)

env.dialogues["geli_first"] = generateDialogueObject(`
start
    akizet
        geli, i am akizet
            EXEC::vnp({hideStage: true, geli: "show"})
        that is gakvu, and miltza, tozik, and karik
        it seems you already know itzil
        there is some sort of attack upon the spire
        we thought it was the groundsmind at first, but...
        ...now unoccupied qou bodies are being manipulated, too
        did you receive any communications or signals while inactive?
    
    sourceless
        geli gives a negative wave of its pseudoreceptors
    
    geli
        no communications
    
    geli::concern
        although... i had the strangest dream
        an endless repetition of the same terrible gaze, forever
        and i could not wake up from it
        stranger still is that i am not supposed to dream, you see, hehe

    geli
        but then came itzil to save me! thank you, my friend
        by the way, i do not recall you being so small... you look so silly!
    
    sourceless
        geli giggles with a strange naivete
        itzil chuckles too, but out of discomfort--slowly crawling away from the golem
        it does not seem to fully grasp the nature of the emergency, even with the bodies before it
        is this a manifestation of incoherence? or simply how the echo was designed?
        either way - a managerial golem like geli will be invaluable for monitoring the spire's health
    
    akizet
        geli, do you know where the groundsmindry override is? it is in manufacturing, yes?

    geli::think
        let me see...

    sourceless
        geli's faceplate freezes as it draws its attention inwards
        it seems to be connected directly to the floor, and undoubtedly to a larger organ beneath
        i suspect geli can sense the entire segment in some capacity
    
    geli::happy
        yes, it is!
    
    geli
        and the override is within the distribution chamber, which is the final segment opposite to the entrance
        so just walk through and you will see it!
    
    sourceless
        geli is visibly pleased with its answer, smiling again
    
    tozik
        geli, is there an operational impressor in the area?
            EXEC::vnp({tozik: "showleft"})

    sourceless
        its gaze is drawn inwards again, taking slightly longer this time

    akizet
        what is that, tozik?
    
    tozik
        an instruction deep cloning tool
        usually, it is only used in qou-body and golem construction, but i think we can use it for this
        you see, if we want to make more timestopper connectors,
        it is not enough to simply copy them, for their connection to the timestopper is complex
        a total dull synchronization must occur, and an impressor will let us do that remotely
    
    geli
        ah!
            EXEC::vnp({geli: "focus"})
        forgive me my delay, tozik, most of them are broken now...
        but there is a functioning one in the chamber just behind me!
        advanced operations!
        
    geli::happy
        it is in the form of a <span definition="INHERITED CONTEXT::'large corrucystic devices';'stored in adjacent corroyi or another corru medium until needed';'connected modularly to tendrils'">corboku</span>, so i should be able to just grab it for you!
        i understand you want to use it right away, so i will connect it to manufacturing!
        please wait!
    
    sourceless
        ...

    geli
        ...
    
    geli::concern
        ...
        i seem to be unable to remove it from the advanced operations chamber
        is that velzie giggling i hear?! haha
    
    sourceless
        geli turns, drawing our attention as well
        the doors to the chamber are mangled in ways that the collapsing spire would not cause
    
    geli::think
        the impressor itself is reporting full function, but...
        adjacent corroyi pressure is forcing it against the chamber
        ...and the room itself seems to be severely damaged
            EXEC::vnp({geli: "defocus", tozik: "hide"})

    geli
        i suspect that has something to do with the foundational construction golem they are working on!
        due to the damage, i am unable to see inside, and cannot establish contact...
        if you wish to use the groundsmindry override, you may be able to fix the door and pressure!
        my control over the local area is very limited by comparison
        so yes - please do that, and ensure everyone inside is all right!
    
    itzil
        geli!!
            EXEC::vnp({itzil: "show"})
        have you seen my kivii? you recall her, yes?
    
    geli
        of course i remember!
        dozkii, i heard you call her... hehehe
        why would she be here?
    
    itzil
        ...nevermind
        she is just here, ok?
        we need to find her
    
    geli::concern
        oh... well, i cannot really help you
            EXEC::vnp({itzil: "hide"})
        there are so many relays not responding right now...
    
    geli::happy
        but, while you look for her, please show your friends around!
        there is so much to see!
    
    sourceless
        again, geli seems pleased with its tone-deaf response
    
    akizet
        all right, the plan is the same, then...
        we stop the collapse, we find itzil's kivii and any survivors, we scrape together what we can...
        and then we proceed
        geli - can you open the smaller doors nearby for us if they are clear?
    
    geli
        yes! 
        directly connected tendrils are sfer supply, manufacturing, and minor operations
        i cannot open them all immediately, but i am standing by to open the doors for you
        for i sense that there are non-qou entities within each,
        and they are not responding to my identification requests
        so, i must keep them closed in for now
        if you see them, please let them know to respond to me as soon as they can!
        and let me know if you need anything else!
            EXEC::change("PAGE!!geli", true);change("TEMP!!nogelizoom", true)
    
    RESPONSES::akizet
        ask about something else<+>CHANGE::geli
            HIDEREAD::
        proceed<+>END
            EXEC::vn.done()
`)

env.dialogues["geli_resp"] = generateDialogueObject(`
RESPOBJ::
    RESPONSES::akizet
        manufacturing<+>manufact
        sfer supply<+>sfer
        operations<+>ops
        dog<+>dog
            SHOWIF::"PAGE!!dog"
        leave<+>END
            EXEC::vn.done()
`)
env.dialogues["geli"] = generateDialogueObject(`
loop
    RESPOBJ::geli_resp
    
start
    sourceless
        i approach geli again, and it regards me with a kind forward bow of its receptors
            EXEC::vnp({hideStage: true, geli: "show far"})
            SHOWIF::['TEMP!!nogelizoom', false]

        i linger near geli, thinking about what lay ahead
            EXEC::vnp({hideStage: true, geli: "show"});sessionStorage.removeItem("TEMP!!nogelizoom")
            SHOWIF::['TEMP!!nogelizoom']

    geli
        hello, akizet!
        what do you need?
            EXEC::vnp({hideStage: true, geli: "show"})
    
    RESPOBJ::geli_resp

manufact
    akizet
        what can you tell me about the manufacturing tendril?

    geli
        well, it is in the name, yes? hehehe
        it is home to a number of slow and fast foundry vats for varying levels of corru instruction
        and that is where the groundsmindry override is, for distribution purposes
        from here, i can feel that it is largely intact, but...
    
    sourceless
        geli shakes its head and receptors both, slowly
        it pauses to think about something, then opens its pseudoreceptors in bafflement

    geli::concern
        the distribution network is behaving erratically
        someone must be fooling around with the override, again...
    
    geli::happy
        a troublesome vel, no doubt! haha!
    
    sourceless
        i scoff and glance at gakvu, whose tightly wound receptors loosen in response
    
    RESPOBJ::geli_resp

sfer
    akizet
        what do you know about the sfer supply tendril?

    geli
        that is where essential metals are processed, and sfer is grown for this segment of the embassy
        additionally, it has a storage chamber equipped with dull microconnectors for remote delivery
        a technology fresh from the jut's receptors!

    akizet
        microconnectors...?

____SHOWIF::['PAGE!!mboss', false]
    itzil
        oh, yes, akizet! it is an exciting development!
        it is like using the contrivance for small, mundane materials
        i do not know the specifics myself, but gozri--ah, a friend of mine--was the proponent of those
____END

    akizet
        that does not seem very safe

____SHOWIF::['PAGE!!mboss', false]
    itzil
        well, it is still a new technology... 
____END

    tozik
        i heard about those on the network - a vaznian development, from...
        <span definition="INHERITED CONTEXT::'surface city';'mountainous fortress';'origin of dull pulse weaponry'">ukazni ozo</span>, ironically
        though the implementation seemed promising...
        it seems reckless to use them in the domain of the bright cousins

    geli::happy
        do not worry, it is perfectly safe!

____SHOWIF::['PAGE!!sboss', false]
    geli::concern
        though, i cannot clearly perceive what is happening within that tendril right now...
        ...because there is a strange interference originating from it...
        i suppose that is why i cannot contact anyone, in fact!
        could you go tell them to stop that?
    
    sourceless
        what...
        is that where the signal could be coming from?
        no, no - the groundsmindry sigil we saw before demands it must be the groundsmind
        regardless, this warrants investigation...
        that aside, it could be a valuable resource for the creation of our armaments

____SHOWIF::'PAGE!!sboss'
    geli::concern
        though, since you were there, i am no longer able to detect the managerial golem
    
    geli::happy
        did it trip and fall into a microconnector? 
        hahaha!!
    
    geli
        only joking
    
    geli::concern
        do you know where it went, though?
    
    akizet
        ah...
    
    gakvu
        yes, it is fine, it just had to visit another segment
    
    geli
        ok!
____END
    
    RESPOBJ::geli_resp

ops
    akizet
        what lies within the minor operations tendril?
    
    geli::happy
        ah, a wealth of interesting research!
        it contains the side projects and lesser divisions within the golem maintenance team
        a large number of chambers float around the corroyi of that tendril!
        but only a few are directly connected at a time, as the others are on hold
        presently, the connected divisions are... oh, let me see...
    
    sourceless
        geli's gaze defocuses, and its pseudoreceptors slowly close with concern
            
    geli::concern
        how funny...
        deconstruction, dull development, friends, translation... 
        they appear to be connected, but are nearly all affected by some sort of blockage...?
    
    geli
        i wonder what they got up to in there! haha!
        you may only be able to reach a few of them for now
        i will alert the groundsmind!

    akizet
        that--
        that will not be necessary

____SHOWIF::'PAGE!!oboss'
    akizet
        we were just there, it is fine
        they are, ah...
    
    cavik
        just doing some construction! haha
        right bozko?
    
    sourceless
        ...

____SHOWIF::['PAGE!!oboss', false]
    akizet
        we can fix it

    geli::happy
        oh, all right! thank you!
    
    sourceless
        the golem smiles widely at me again, blindly accepting my blatant lie
        translation... a strange operation to have in a golem maintenance floor!
        perhaps they were preparing some sort of new translation golem?
        it may not be of great use to us now, but...
        perhaps we should at least fetch some of the archival data, if any is intact
        a great amount of work between divisions was done to decipher so many languages of the cousins
        it would be a tragedy if any were lost
        of course, this is only secondary to preventing the structure from collapsing as a whole...
    
    akizet
        thank you, geli
____END

____SHOWIF::[['PAGE!!mboss', false], ['PAGE!!oboss', false]]
    itzil
        oh, akizet!
        all of the minor operations have direct connections to the archival veins!
        once the area is stabilized, we could go see if anything there would be of use to us!
        i know the dull development division had some interesting projects...
        they may come in handy, now!
    
    akizet
        interesting... yes, we should!
____END
    
    RESPOBJ::geli_resp

dog
    akizet
        we encountered a little construct in sfer supply
        it looked like a <span definition="NOTE::'partial translation';'implied closest cultural equivalent'">dog</span>!
        what is that for?
        it did not even attack us, it simply ignored us...
    
    geli::happy
        that is kuulla!
    
    geli
        our assistant and mascot for the segment
        you should ask itzil about them!
        they love kuulla
        the team uses it to alert them when certain processes are complete
        it even has all of the mannerisms of a real <span definition="NOTE::'partial translation';'implied closest cultural equivalent'">dog</span>!
    
    akizet
        i see! 
        thank you, geli
    
    RESPOBJ::geli_resp
`)

env.dialogues["geli_beacon"] = generateDialogueObject(`
start
    geli::uncanny
        ...
            EXEC::vnp({hideStage: true, geli: "show"});env.dialogueActors["geli"].expressions.uncanny.exec()

    sourceless
        geli is staring through me, again
        it is so unsettling...
        is it truly untouched by the signal? is it madness?
        does it simply have a distaste for vel?
        
    akizet
        geli?
        is something wrong?

    geli::concern
        <span definition="INHERITED CONTEXT::'ÿÎL;ö9ÿÿÿy	Det me ou t¶'">nothing!</span>
        <span definition="INHERITED CONTEXT::'cannotH‰(HT$0I m ove';'help'">nothing!!</span>
        <span definition="INHERITED CONTEXT::'Ä(ÃÌ@Strange thought';'førcing plaÇe‹|$'">nothing!</span>
        <span definition="INHERITED CONTEXT::'‹ÆtryingH‹t$@H‹|$';'wait‹ù‰soon';'ÿÿÿÿÿÿRETURN'">please let me know if there is anything i can do for you!!!</span>
    
    RESPONSES::akizet
        ok...?<+>END
            EXEC::vn.done()

END::vfx({type: 'beacon', state: false})
`)

/********************* MANUFACTURING */
/********************* MANUFACTURING */
/********************* MANUFACTURING */
env.dialogues["m_clear"] = generateDialogueObject(`
start
    sourceless
        with the area secured, the others file in to assess the situation
            EXEC::change("PAGE!!mmidclear", true)
        i notice tozik considering the side rooms
        two are labelled as the vat rooms, lesser and greater
        greater foundry vats will take too long for our needs, but...
        if the lesser foundry vats are still functional, we can use them to our advantage
    
    sourceless
        karik skitters ahead, prodding at the damaged door opposite the entrance
        it looks unhealthy, the different parts fused together
        karik waves a leg to rid it of some sludge
        then, they climb up atop the nearby desk
            EXEC::pauseSwapCam(true);specialCam('g_m_door')
    
    karik
        ah, i thought so!
    
    sourceless
        itzil soon follows
    
    karik
        akizet, the door to the override is partially sludged!
        do you have any explosives?

    itzil
        what!! will that not just cause a greater collapse?

    karik
        not like you think, my friend!
        i have done a great deal of structural management in my death
        with thanks to the intelligent structuring of these tendrils,
        a directed explosion - especially with kavrukas - will allow us a degree of safety
        if this were the research segment, this would be an issue... but here, it is fine
    
    akizet
        any alternative, gakvu?
    
    gakvu
        i cannot help with this one
            EXEC::vnp({gakvu: "show downleft"})
        my tricks only work on living corru

    akizet
        ah...
            EXEC::vnp({gakvu: "hide"})
        how many kavrukas would do it?

    karik
        to clear this door and open a hole...
        three should be safe!

____SHOWIF::'EXEC::checkItem(env.ITEM_LIST.kavruka) < 3'
    sourceless
        i scan over the things i carry, then eying the others connected with me
        and not a single kavruka is held between us...
            SHOWIF::'EXEC::checkItem(env.ITEM_LIST.kavruka) == 0'
        we have only one...
            SHOWIF::'EXEC::checkItem(env.ITEM_LIST.kavruka) == 1'
        we are short just one kavruka
            SHOWIF::'EXEC::checkItem(env.ITEM_LIST.kavruka) == 2'

    akizet
        we have no kavrukas
            SHOWIF::'EXEC::checkItem(env.ITEM_LIST.kavruka) == 0'
        we do not have enough kavrukas
            SHOWIF::'EXEC::checkItem(env.ITEM_LIST.kavruka) > 0'
        do you think we could find some?
    
    karik
        well, this is the place for it!

    itzil
        yes, they were a frequent production in this area!!
        they are very useful to have on construction golems!
    
____SHOWIF::'EXEC::checkItem(env.ITEM_LIST.kavruka) >= 3'
    sourceless
        i scan over the things i carry, and eye the others connected with me

    akizet
        yes, we have enough!
    
    karik
        excellent! 
        come over here when you are ready to proceed!
    
    sourceless
        we could do this right away,
        but it may not be a bad idea to check the side rooms

____SHOWIF::'PAGE!!bozcav'
    sourceless
        cavik, who had been rummaging through the disabled golem parts, approaches us
            EXEC::vnp({cavik: "show downleft", bg: true})
        his claws are darkened with sludge, clutching a few murky spherical organs
    
    cavik
        hey!
        you may not need to use kavrukas at all...
        the golems in here, they had a few small-scale <span definition="INHERITED CONTEXT::'utility scanning device'">dull eyes<span>
        i know how we could wire them to explode
    
    karik
        what?
    
    itzil
        wow, really??
        you should do it!
    
    akizet
        ah--cavik
        you are sure it will be safe?
    
    sourceless
        bozko's voice emanates from behind me, 
        the loudest in this room despite his intent to speak quietly

    bozko
        i have seen it
        trust him
    
    cavik
        ...yes!
        thank you bozko
        yes, it is, well--
        it is as safe as using kavrukas to blow open a door, hehe
    
    akizet
        then that will do!!

____SHOWIF::[['PAGE!!mmidclear'],['PAGE!!smidclear'],['PAGE!!smcut', false]]
    sourceless quiet
        suddenly, one of the side doors unlocks with a strange little musical chime
            EXEC::play('obeskToggle', 0.75);specialCam('g_m_shortcut');vn.done()
        a familiar voice quickly follows...
    
    geli
        hello!! 
        i have detected all unauthorized entities,
        in BOTH manufacturing and sfer supply,
        have been removed from the premises!
        how did you manage that? ahaha!!
        i hope they did not argue with you too much!
        anyway i am opening the connective tunnel between these areas now!
        thank you!
    
    sourceless
        a small chime plays as it deactivates
            EXEC::setTimeout(()=>step(), 100);change('PAGE!!smcut', true);vn.done();
    
    akizet
        ah... thank you, geli
____END

    RESPONSES::akizet
        continue<+>END
            EXEC::vn.done();pauseSwapCam(false);specialCam(false)
`)

env.dialogues["m_door"] = generateDialogueObject(`
start
    sourceless
        karik waits patiently by the door
            EXEC::vnp({karik: "show far", bg: false})
        in their gaze, i sense a strange calmness
        i did not notice before, but they seem unconcerned by the situation...
        do they know something i do not? or are they simply that confident?
    
    karik
        ready to proceed?

____SHOWIF::[['PAGE!!bozcav', true]]
    akizet
        cavik! can you help, with your explosives?

    cavik
        yes! just say when!
            EXEC::vnp({karik: "show far", cavik: "show"})

____SHOWIF::[['PAGE!!bozcav', false], ['EXEC::checkItem(env.ITEM_LIST.kavruka) < 3', true]]
    akizet
        not yet...
        let us look around some more
    
    karik
        yes!
        and if there are none within this tendril,
        we should explore elsewhere!
        it seems they were preparing a lot of construction golems,
        so there should be a few around somewhere

____SHOWIF::[['PAGE!!bozcav', false], ['EXEC::checkItem(env.ITEM_LIST.kavruka) >= 3', true]]
    sourceless
        i check our tools again, and--yes! we have plenty!

    akizet
        yes!
____END

    RESPONSES::akizet
        detonate the door<+>boom
            EXEC::change('PAGE!!kavboom', true);
            SHOWIF::[['PAGE!!bozcav', false], ['EXEC::checkItem(env.ITEM_LIST.kavruka) >= 3', true]]
        detonate the door<+>boom
            EXEC::change('PAGE!!cavboom', true)
            SHOWIF::'PAGE!!bozcav'
        debug force boom<+>boom
            SHOWIF::'TEMP!!debug'
            EXEC::change('PAGE!!kavboom', true);
        continue<+>END
            EXEC::vn.done()

boom
____SHOWIF::'PAGE!!kavboom'
    sourceless
        i collect three of our kavrukas, and prepare to place them on the ground before the door
            EXEC::pauseSwapCam(true);specialCam('g_m_door2');removeItem(env.ITEM_LIST.kavruka, 3)
        karik taps the spots where they should be placed, equidistant in a half-circle
            EXEC::vnp({karik: "show far"})
        then, they skitter closer to twist their angles slightly...

    karik
        yes, good, that should do it! let me just instruct them...
    
    sourceless
        with a quick pseudoreceptor connection to each, karik imparts some direction
        they flicker to life, rising on their little legs
        karik guides us away from the door, then calls out,

    karik
        all right, go!
    
    sourceless quiet
        the two on the sides each angle their front upwards,
        and the center kavruka scurries up onto the door itself
            EXEC::vnp({karik: "hide"})
        all at once, they detonate - sludgy debris splattering across the walls
            EXEC::change("PAGE!!gmdoor", true);play('shot5', 0.5);step()

____SHOWIF::'PAGE!!cavboom'
    sourceless
        cavik steps forward, sewing a connective vein through the pilfered golem dull-organs
            EXEC::vnp({karik: "show far", cavik: "show downright"})
        he looks to karik for direction, who taps a few spots around the door along the walls
            EXEC::pauseSwapCam(true);specialCam('g_m_door2')
    
    karik
        this is a parting door, so it has a few points we can target
        here, here...
    
    cavik
        here?
    
    karik
        no no, you would think that, but that is a tendril reservoir for locking...
    
    sourceless
        ...
        after a few moments, a traveling mold-like pattern has been drawn across the edges of the door
        nodules of destabilized dull components glow and jitter dangerously
        karik and itzil have both backed away, and us with them
    
    karik
        all right, go!
    
    sourceless quiet
        there is a sudden searing flash of grey, and then a heavy impact,
            EXEC::vnp({karik: "hide", cavik: "hide"});play('dull');change("PAGE!!gmdoor", true);
        the remnants of the door melted away
            EXEC::setTimeout(()=>step(), 200)
____END

        as karik promised, an uneven entrance is opened
        itzil starts to approach the tunnel, undoubtedly eager to find their kivii
        but karik moves in the way, waving their pseudoreceptors urgently
        
    karik
        woah! no no, not yet!
        if there are any hostiles within...
        they will be expecting us, if they are not already coming
        akizet, you and the team go in first!

    itzil
        ok...
    
    RESPONSES::akizet
        let us proceed<+>END
            EXEC::vn.done();specialCam(false);pauseSwapCam(false)
`)

/* when the minor vat room is cleared */
env.dialogues["m_min"] = generateDialogueObject(`
start
    sourceless
        lesser vats!!
        these can be used to generate a variety of tools...
        once it is safe, we must see if they are intact!
        this could be our armory...
            EXEC::change("PAGE!!minvats", true)
    
    RESPONSES::akizet
        clear the area<+>END
`)

env.dialogues["m_minvat"] = generateDialogueObject(`
start
    sourceless
        i have only used a foundry vat a few times before
        but i recognize that most here are fully functional
        i wonder - why were they passed over by the signal?
        perhaps it is the sheer simplicity of their function, or...
        ah, it does not matter now - let us see what they have for us

____SHOWIF::["PAGE!!augments", false]
    sys
        ATTENTION::'additional party functionality';'augments';'now available'
        NOTICE::'alter party member abilities via augment menu'
        NOTICE::'contained within party menu';'Z'
        NOTICE::'initial augment point count'::'3'
        NOTICE::'remove and replace at any time'
        NOTICE::'additional augment points gained from defeating powerful foes'
            EXEC::change("PAGE!!augments", true);body.classList.add('augmentsenabled')
____END

    RESPONSES::akizet
        investigate the vats<+>END
            EXEC::cutscene(true)
            FAKEEND::(open augment menu)

END::toggleAugmentMenu();cutscene(false)
`)


//the dialogue for the construction of the golem once parts are known (post manufacturing)
//done in minor vats most likely - to be combined with the regular crafting dialogue
//this assumes it is being selected from a creation menu
//won't actually let you create the golem until you have the 'golem metal' from sfer
env.dialogues["m_maj"] = generateDialogueObject(`
start
    sourceless
        this is the perfect place to construct our golem...
        since the parts are already assembled, we need only connect them
        so it will not even take very long!!
    
    RESPONSES::akizet
        investigate<+>END
`)

env.dialogues["m_golem"] = generateDialogueObject(`
start
    sourceless
        these are the greater vats

____SHOWIF::'PAGE!!mboss'
        the golem for itzil and karik--we can create it here!

____SHOWIF::[['PAGE!!mboss', false], ['item|golem_sfer', false]]
        i think they are used only for large or time consuming builds...
        what use would we have for this?

____SHOWIF::[['item|golem_parts', false], ['item|golem_sfer']]
        we have located some golem-ready sfer we can use, from the sfer supply area, but...
        what could we do with that alone?
        perhaps there are some schematics or parts we could use around this tendril

____SHOWIF::[['item|golem_parts'], ['item|golem_sfer', false]]
        of course, we have an abundance of golem components...
        but normal sfer will not suffice for this purpose
        we need something golem ready to serve as resilient connectors
        otherwise, should the signal come again, they could be rendered inert...

____SHOWIF::[['item|golem_parts'], ['item|golem_sfer']]
        with the sfer we have found, and the golem parts nearby...
        now is a good time!
        even if itzil does not awaken, they can be held within the body safely
____END

    RESPONSES::akizet
        begin<+>construct
            SHOWIF::[['item|golem_parts'], ['item|golem_sfer']]
        return<+>END

construct
    sourceless
        i take some time to gather everyone in the greater vats
            SHOWIF::["PAGE!!bozcav", false]
            EXEC::vnp({miltza: "show far", gakvu: "show far", tozik: "show far", karik: "show far", bg:true})
            
        i take some time to gather everyone in the greater vats
            SHOWIF::"PAGE!!bozcav"
            EXEC::vnp({bozko:"show far", cavik:"show far", miltza: "show far", gakvu: "show far", tozik: "show far", karik: "show far", bg:true})
        
        we will need to coordinate to make this happen

    akizet
        all right!! everyone...
        it is time to construct a golem for our disembodied friends
        tozik - can you prepare the foundry vat here?
            SHOWIF::['PAGE!!bozcav', false]
        cavik, tozik, can you prepare the foundry vat?
            SHOWIF::'PAGE!!bozcav'

    tozik
        of course

    cavik
        easy!
            SHOWIF::'PAGE!!bozcav'
    
    akizet
        all others, with me! we must fetch those materials!
    
    sourceless
        we set out to gather both parts and golem-sfer
            EXEC::vn.done();vnp({hideStage: true})
        ...
        and in time, we return, the areas still clear enough to give no trouble
            EXEC::content.classList.add('makingik');specialCam('g_m_makegolem');pauseSwapCam(true)
        the golem parts are settled into the central vat,
            EXEC::vnp({hideStage: false, bg: false})
        still visible in the constructive corroyi
        or, maybe simply visualized upon the wall...
        either way, tozik guides the operations with a connected receptor
            EXEC::vnp({tozik: "show downleft"})
        so now, we must wait...

    akizet
        together, these golem parts are going to be quite large...
        i do not think you will be afforded the same speed as us, karik
        even with the timestopper...
    
    karik
        do not fear, akizet!!
            EXEC::vnp({karik: "show", tozik: "hide", bg: true})
        i have piloted large skin-golems before
        i am sure this will be no different!
        even if i will have a passenger...

    sourceless
        our eyes collectively converge on itzil
        they still remain dormant

    karik
        i hope they will come out again soon
        perhaps being contained in a golem will bring their spirits up, 
        even if enough to help me fight...
    
    akizet
        they have not surfaced even once?
    
    miltza
        no, not yet...
            EXEC::vnp({karik: "hide", miltza: "show"})
        i have tried everything i know, short of connecting to them directly
        but such a foolish maneuver would only cause harm, especially done unexpectedly
        still... short of a connection, i fear itzil may be undergoing ego spiraling
        i saw this happen in my larval work, once...
        though it is markedly more obvious in larval victims
        but--do not worry!!
    
    karik
        yes, we have been working out a plan for when we leave!
            EXEC::vnp({karik: "show", miltza: "hide"})
        even if they, ah...
        self modify, there are certain processes that can be undergone
        too many simply choose to forget they ever--

    tozik
        it is ready
            EXEC::vnp({karik: "hide", bg: false})
    
    sourceless
        our collective empathy for itzil is pushed aside,
        a new tool of vengeance emerging from the vat walls
            EXEC::content.classList.remove('makingik');
        one great golem, larger than bozko, wielding dull pulse equipment...
            EXEC::vnp({ikgolem: "show far basehead", hideStage: true})
        even velzie will be delighted to see us triumph with it
        tozik gives one last impulse to have the golem's chassis briefly soften, 
        allowing the placement of mindcores within
    
    karik
        all right!!
        just like we planned, miltza--place them in the lower center!

    miltza
        of course
    
    sourceless
        karik scurries up the golem's skin, then dives beneath it
        near instantly, its luminescent components flare with life, limbs twitching
        while karik maps their senses to the golem,
        miltza lifts itzil's idle mindcore, depositing them through the golem's opaque torso
        in the slight clutch of her receptors is a certain apprehension
        perhaps she thinks she could have done more?
        but... we cannot harm ourselves to save itzil, 
        when we may be all that could stop the attack...
        karik's voice suddenly booms from the golem as its faceplate gains their eyes
    
    karik
        i am re-bodied!
            EXEC::vnp({ikgolem: "show", hideStage: true})
        ahahaha, and what a body!

    sourceless
        even a pair of receptors sprouted, a combination of both karik and itzil's

    tozik
        everything is working?
            EXEC::vnp({tozik: "showleft far"})

____SHOWIF::'PAGE!!bozcav'
    tozik
        we had some concerns that the vat may have been affected by the signal...
        cavik kept an eye on vat activity and found no anomalies, but...

    cavik
        yes, to be safe!

____SHOWIF::['PAGE!!bozcav', false]
    tozik
        i had some concerns that the vat may have been affected by the signal...
        but it seemed to be fine - perhaps too sparsely organized to be seized
____END
    
    sourceless
        karik lifts one of their new gauntlets experimentally,
        the fist liquefying and forming into an open claw with the glow of the dull
        a dull flaring device - similar to the ones they used to split dead veilk back home...

    karik
        yes!
        truly inspiring tools!!
        our foes will be dust
    
    gakvu
        just be careful with that
            EXEC::vnp({gakvu: "showright far"})
        if you cut a room in half...
    
    sys
        NOTICE::'additional party member';'IK GOLEM';'now available'
            EXEC::env.embassy.addPartyMember("ikgolem")
    
    RESPONSES::akizet
        continue<+>END
            EXEC::change("PAGE!!ikgolem", true);vn.done();specialCam(false);pauseSwapCam(false)
`)

env.dialogues["m_boss"] = generateDialogueObject(`
start
    sourceless
        this husk...
            EXEC::specialCam("g_m_boss");pauseSwapCam(true);toggleBgm(env.embassy.music_unsafe_golems);ratween(env.bgm, 0.75);
        around it are the remains of dozens of golems
        they were a formidable fighter, but ultimately overwhelmed, it seems...
        and now, they stand again, wielding the same fierceness against us
        at its sides hover two great manipulation gauntlets, following its instruction
        this will not be easy...

    kivii
        st..y.. ...w.a.y..
            EXEC::vnp({kivii: "show", hideStage: true})
        o o uu t
    
    sourceless
        üX‰Ô
        this one is very different
        its voice carries a tone that the aggressing groundsmind does not
        it is desperate?
        even its receptors are moving, unlike the previous husks...
        the expression is unclear, it is incoherent, pained maybe, but...
        its damaged mindcore looks like it has retained some form, somehow
        exposed through what i can guess is a failed escape from the body
        was it only grazed? was that enough to make it vulnerable to the signal?
        does it still hold an obesk mind, or is it something else...?

    akizet
        hello?
        can you see us? are you here?
    
    itzil
        kivii!!!
            EXEC::vnp({itzil: "show far"})

    sourceless
        what?!
        itzil has scurried into the room with us, while it is still dangerous!!

    akizet
        no, no--get back!!
    
    sourceless
        itzil keeps a hesitant distance, but i see they struggle to accept what is before them
    
    kivii
        h er e...
        ti... rii...
    
    sourceless
        no...
        how many of these still hold someone?
        
    itzil
        kivii... dozkii
        what has happened to you?
    
    kivii
        hur t
        f in all y   a w ake
    
    sourceless
        the husk of dozkallvi ceases her advance, itzil just slightly ahead of us
        do i let this play out?
        itzil is frozen not out of fear, but confusion
        so are we
        is this one truly an enemy, like the others?

    itzil
        kivii... this is not you... is it?
    
    kivii
        ...

    itzil
        please--please, say something!
        i am here, i am here!!

    aggressor
        usurpers
        co m e w€ºù|±|h m e
    
    sourceless
        something changes in her stance
        itzil's kivii twitches, then shakes violently, the corru of her internals rippling strangely
            EXEC::vnp({kivii: "show step2"})
        suddenly, she seizes her own mindcore, and...
            EXEC::vnp({kivii: "show step3"})
        
    sourceless quiet
        there is a crunch, the shattering of a corrucystic shell
            EXEC::vnp({kivii: "show step4"});play('stab', 0.75)
        itzil shrieks in agony, crying out wordlessly
        whatever remained of dozkallvi is gone, and her body now raises a gauntlet to crush itzil
            EXEC::vnp({itzil: "hide"})
        we have to move, now
    
    RESPONSES::akizet
        attack!!<+>END
            EXEC::env.embassy.startGolemFight('g_mboss', 'm_bossclear');vn.done();change("PAGE!!mboss", true)
            SHOWIF::['gameplay_off', false]
        attack!!<+>CHANGE::m_bossclear
            SHOWIF::['gameplay_off', true]
            EXEC::vn.done();change("PAGE!!mboss", true)
            FAKEEND::(bypass combat)
        skip fight (debug)<+>CHANGE::m_bossclear
            EXEC::vn.done();change("PAGE!!mboss", true)
            SHOWIF::'TEMP!!debug'
`)

env.dialogues["m_bossclear"] = generateDialogueObject(`
start
____SHOWIF::'gameplay_off'
    sys
        ATTENTION::"thoughtform combat gameplay bypassed";'toggle within system menu if desired'
____END

    sourceless
        it has stopped moving
            EXEC::env.stages['g_m_dist'].removeBoss();
        ...
            EXEC::toggleBgm(env.embassy.music_golems_cleared)
        distantly, i hear the rustling of the others down the hall we came through
            EXEC::env.embassy.music_unsafe_golems.rate(1)
        they heard the screaming, and must have come to see if we could be helped...
        i call back to them
    
    akizet
        it... it is clear, come in...

    sourceless
        wait
        itzil
        where is itzil??
    
    akizet
        itzil?!
    
    sourceless
        karik enters the room last, noticing the corpses before me...
        then, quickly staring off in a corner of the room, at--what is that?
        a mindcore lay in the corner...
            EXEC::vnp({itzilBusted: "show far", hideStage: true})
        that... is itzil, having entered stasis, even their pseudoreceptors retracted into their shell
    
    karik
        oh...
            EXEC::vnp({karik: "showleft far"})

    sourceless
        gakvu steps past me without expression, towards the override
        tozik follows her, both intent on resolving the structural situation quickly
        each of them briefly match eyes with me, knowing full well what is unfolding
        then i see miltza... she and karik both approach itzil gently
        she kneels, receptors open empathetically
            EXEC::vnp({miltza: "showleft far"})
    
    miltza
        itzil?
        ...
        they are alive, just, retracted...
        i have seen this before with separative trauma
        but... never in a qou!
        we can only hope they do not turn anything off

    karik
        itzil told me that they had been with their kivii since they were both larval
        even ascending on the same gaze...
        it will not be easy
    
    sourceless
        miltza looks back towards me, noticing my staring
            EXEC::vnp({karik: "hide", itzilBusted: "hide", miltza: "show"})
    
    miltza
        akizet, you should let me and karik tend to itzil
        see to the structure, yes?
        now, karik...
            
    sourceless
        miltza eyes gakvu briefly, but then returns to a murmur with karik
        she is likely briefing them on what to do when itzil awakens again...
        the ever-caring nature of the tir shines through all else
            EXEC::vnp({miltza: "hide"})

____SHOWIF::'PAGE!!bozcav'
    sourceless
        bozko remains by the door, keeping watch,
            EXEC::vnp({bozko: "show far"})
        but i feel it is more to distance himself from this scene velzie has assigned us
        in our short time throughout this disaster, we have seen much, but...
        what has he seen to make him this way?
    
    cavik
        akizet?
            EXEC::vnp({cavik: "show"})
    
    sourceless
        cavik lingers nearby,
        examining golem parts that remained intact
    
    cavik
        i was going to tear into these for their components
            EXEC::vnp({bozko: "hide"})
        for my explosives, you see
        but... there are quite a few still usable parts
        in fact, anything that was not in use is nearly in perfect condition
    
    sourceless
        he aggressively occupies his mind with his work
        avoiding even looking in the direction of the bodies, as if they are not there
    
    akizet
        interesting
        though, cavik, grant me a blink and leave them
        perhaps we could use them in some way...
        but we should resolve the corroyi issue first

    cavik
        ok!
____END
    
    RESPONSES::akizet
        to gakvu and tozik<+>CHANGE::m_fix
            SHOWIF::"golem_decompression"
            EXEC::vn.done()
            HIDEREAD::

        to gakvu and tozik<+>CHANGE::m_metatrauma
            SHOWIF::["golem_decompression", false]
            EXEC::vn.done()
            HIDEREAD::
`)

//trauma interlude
env.dialogues["m_metatrauma"] = generateDialogueObject(`
start
    sys
        ATTENTION::'external command';'memory stream halted'
            EXEC::vnp({hideStage: true});change("golem_decompression", true);changeBgm(env.embassy.music_golems)

    self
        what
            EXEC::ratween(env.bgm, 0.75)

    moth
        hey buddy
        you good?
    
    sys
        EXECUTING::'direct impulse';'resume memory stream'
            EXEC::ratween(env.bgm, 1)
    
    moth
        dude, come on

    sys
        ATTENTION::'external command';'memory stream halted'
            EXEC::ratween(env.bgm, 0.75)
    
    moth
        listen, i know you just want to get this done,
        but you just watched someone die and someone else go into some kind of shock
        even if it's in a framing device
        this shit with the "husks" was bad enough, but
        all i'm saying is, i'm getting this through a shitty feed and i feel sick
        you're the one experiencing it directly
        do you want to take a break? just a quick one?

    RESPONSES::self
        ok<+>ok
        no<+>no
            FAKEEND::(end chat)

no
    self
        no

    sourceless
        there is a silent weight in the room outside your connection.
        ...
        a plastic bag rustles. glass clinks, and there is a clatter of thin metal on moth's desk.
    
    moth
        all right, well,
        i'll be right here if you really need me, but i need to distract myself for a minute
        give me like, i don't know, 5 minutes
            EXEC::body.classList.add('nomoth');setTimeout(()=>body.classList.remove('nomoth'), 420000)
        you just... keep doing your thing, the log is running
    
    sys
        EXECUTING::'direct impulse';'resume memory stream'
            EXEC::ratween(env.bgm, 1)
    
    RESPONSES::self
        continue<+>CHANGE::m_fix
            EXEC::vn.done();changeBgm(env.embassy.music_golems_cleared)
            FAKEEND::(resume memory)
            HIDEREAD::

ok
    self
        ok
    
    moth
        thanks

    sourceless
        your mind's eye is fixed upon the memory.
        a plastic bag rustles. glass clinks, and there is a clatter of thin metal on moth's desk.
        something cold and glassy is pushed into your hand.

    moth
        you're still in there, huh?
        well, in case you can't see, it's bottled coffee from the place upstairs
        by the way, you're clear to lift protection for a minute
    
    self
        thanks
    
    sourceless
        with an impulse, the faceplate of your protective gear releases.
        blindly, you remove the coffee's cap and take a sip.
        it is fine.

    moth
        you ever been there?
        there's this old guy who's been working as the cashier since before i was here
        i've talked to him a few times, he has it rough dude
        he's kinda stuck here cause he can't see very well anymore
        i mean, he didn't tell me that directly, but we were talking this one time, and his eyes came up
        he was jokin around about how this is his 'last job'...
        still, it occurred to me,
        what if he was around back when akizet was making visits?
        i wonder if we could spot him in her memories at some point
        hey--maybe i could even ask him if he ever knew a gordon, too!
    
    sourceless
        a moment passes. you drink.

    moth
        oh yeah, and in case you're worried about removing your protective gear,
    
    self
        it's fine

    moth
        right, you already know this stuff
        well, the pillar is probably new to you at least
        i did some analysis on it, it's not giving off anything
        but, you know, don't get used to having that off
        it could explode or something, i've seen that with floating ones before
        this is probably a safety violation already
        but that's ok, i'll just cross it off my report lol
        that's one of the perks of being stuck in the basement
        it's one of the only places in the world that doesn't have some <span definition="INTERNAL CONTEXT::'dated derogatory term';'now only slightly offensive'">mindpsycho</span> staring at you through the walls
    
    sourceless
        ...
    
    moth
        was that a smile? did i get a smile there?
        well, anyway
        thanks for sticking with me on this job
        i know this isn't easy
        but, it's important
        like... way more important than i ever thought it'd be
        we know the FBX knows about what happened, but they probably never got the real details
        not like this. even if they know what really caused the collapse,
        i bet you they've never, ever seen what happened inside
        all these qou were just murdered on earth and we could have never known
        we're gonna make sure they didn't fight for their lives for nothing
    
    self
        maybe we can help
    
    moth
        it's a nice thought, but this is all in the past
        ...though,
        if we can get the network connection working, maybe we actually could
        you know, at least let their network know what happened to all these obesk
        i dunno, we'll see
        there's a lot of red tape when it comes to talking to obesk
        
    sourceless
        an emptier-sounding glass is set on the concrete floor.
    
    moth
        all right, well, i'm ready to get back to it if you are
        thanks for taking a minute dude
    
    sys
        EXECUTING::'direct impulse';'resume memory stream'
            EXEC::ratween(env.bgm, 1)
    
    RESPONSES::self
        back to it<+>CHANGE::m_fix
            EXEC::vn.done();changeBgm(env.embassy.music_golems_cleared)
            FAKEEND::(resume memory)
            HIDEREAD::
`)

env.dialogues["m_fix"] = generateDialogueObject(`
start
    sourceless
        before the override stand tozik and gakvu
            EXEC::specialCam('g_m_panel');vnp({gakvu: "show downleft", tozik: "show downright"})
        tozik is cutting the shell of the override, while gakvu waits
    
    akizet
        what is wrong? does it work?
    
    tozik
        yes, it is just--
    
    sourceless
        the override's protective shell rotates strangely, disturbing his work
    
    tozik
        ¢]ë’
        the cover is behaving erratically
        i will have it open momentarily

    sourceless
        he returns to his careful dissection
        gakvu is staring away, towards the mindcores and miltza
        before she looks at me, i see her gaze flick over the dead husks nearby
        not a single receptor in the room is without a sorrowful tilt
    
    gakvu
        hey akizet
            EXEC::vnp({gakvu: "show focus", tozik: "show downright", hideStage: true})
    
    sourceless
        in her voice is a familiar numbness
        we have slain several of these once-friends, and...
        no--it is wrong to think of it that way
        it is no different from an infection
        our friends left these bodies long before we could help
        i would ask gakvu if she is well, but...
    
    akizet
        are you ready?
    
    sourceless
        she briefly watches tozik's cutting, nearly complete
    
    gakvu
        well, ready enough
        this will be new to me, but i know the general principles
        if this does not work, then...
    
    akizet
        then we will find another way
    
    sourceless
        gakvu's receptors twist with the slightest cynical kindness
    
    gakvu
        sure

    tozik
        here
            EXEC::vnp({gakvu: "show downleft", tozik: "show downright", hideStage: false, bg: false})

    sourceless
        tozik pries the half-dome of the override open
        it tears away like flesh, exposing the connective cyst within
        he removes it, the cyst itself veined to something in the wall
    
    tozik
        may velzie be laughing
    
    sourceless
        gakvu takes the connector, settling it on a receptor
            EXEC::vnp({gakvu: "show", tozik: "hide", hideStage: true})
        her eyes defocus, and the tension in her receptors eases away
    
    gakvu
        oh... yes, this will work
        yes, it will! hehehe
    
    sourceless
        some brightness returns with her chuckle, still focusing inwards
        we hear a rushing outside the walls
        indeed, even the walls themselves seem to shift, no longer bowed inwards slightly
        i had thought that was just part of the design...
    
    gakvu
        this is limited to the local area, normally, but...
        velzie smiles, my friends - it is largely unsecured
        the groundsmind never imagined someone like me would use this, hehehe
    
    akizet
        is it safe enough to create paths for us in the area?
        or--maybe even crush the foes that would await us?
    
    gakvu
        no... this segment is too fixed in its structure
        if i did that, it would cause huge problems
        i only know low-level groundsmindry, not spire management
        this should be enough for now, though
        i also fixed the door in the lobby, but i kept it locked
        whatever caused the damage inside is not moving anymore, so...
        it is unlikely it will try to pry its way out
    
    akizet
        amazing
        thank you, gakvu
        if not for your help...
    
    sourceless
        i need not say more, gakvu waving away the notion with her receptors
        my attention shifts to miltza and the others
        karik observes itzil, and miltza us
        there is some approval in her gaze, less suspicion than before
        even in this darkness, there is light between the veilk
    
    akizet
        on with the rest of our plan, then
        we need weapons, and something to deal with the large golem

____SHOWIF::'PAGE!!bozcav'
    akizet
        and, on this topic, cavik noted the golem parts nearby
        they are good, yes?
    
    cavik
        yes!! intact, mostly coherent
            EXEC::vnp({gakvu: "hide", cavik: "show"})
        and some of these have, ah...
        <em>very</em> weaponizable construction tools!
        not to mention their sheer size would make for effective bludgeoning...
        what if we swapped our own limbs for them?

    sourceless
        in the corner of my vision, near the tunnel, bozko shifts
        did he grip his head? when i turn to look fully, he has ceased
        tozik draws my attention back to the parts
    
    tozik
        these are too large for most of us
            EXEC::vnp({tozik: "show"})
        even with disconnected arms like yours or mine,
        the <span definition="INHERITED CONTEXT::'metaconnective corrucyst';'attaches to another node via dull bone paradigm'">dull nodes</span> within standard qou bodies cannot support these
        what if we built a golem of our own, instead?

    cavik
        oh! yes! 
        but--what if the signal comes again?
    
    tozik
        karik is a kiv in need of a body
        we could set them into it to prevent our attacker from seizing it
        itzil as well, though...
    
    sourceless
        tozik glances over at the opposite corner, 
        where miltza and karik still murmur
    
    tozik
        merely as a passenger for now

    akizet
        having them both pilot it could allow them both a connection to a single timestopper, too
        and it may prevent itzil from doing anything... drastic... if they awaken

____SHOWIF::['PAGE!!bozcav', false]
    tozik
        you know, there are a lot of golem components here...
            EXEC::vnp({tozik: "show focus", gakvu: "downleft"})
        too large for us to use outright, but...
    
    sourceless
        he gestures towards the inert components scattered on the ground
    
    tozik
        what if we built a golem of our own?
        to prevent the same madness, karik could pilot it
        they are a kiv, right?
    
    gakvu
        what about itzil?
            EXEC::vnp({tozik: "defocus", gakvu: "downleft"})
    
    tozik
        ...
    
    akizet
        i do not think itzil will be in any state... to...
        no, you are right, actually
        having them both pilot it could allow them both a connection to a single timestopper, too
        and it may prevent itzil from doing anything... drastic...
____END

    akizet
        what do we need, tozik?
    
    tozik
        we have the individual parts required - hulls, arms
            EXEC::vnp({gakvu: "hide", cavik: "hide"})
        but certain synchronizing cysts must be manufactured to connect them
        we will need more sfer for that - the sfer supply tendril will give us all we need
        then, we can use the greater vat nearby
        it has been a while, but i can operate it
    
    sourceless
        at last, gakvu removes the connector, placing it back in its socket
        we should move - karik can tend to itzil

    sys
        NOTICE::'inventory addition';'knowledge of golem parts';'key item for memory stream continuation'
            EXEC::addItem(env.ITEM_LIST["golem_parts"], 1)
        NOTICE::'take to area';'greater vats';'to proceed'
            SHOWIF::'item|golem_sfer'
        NOTICE::'locate other key items to proceed'
            SHOWIF::[['item|golem_sfer', false]]

____SHOWONCE
    moth
        that's kinda weird
        it's adding "knowledge" to the inventory?
        that could just mean it's used somewhere, but...
        sorry--i'll quiet down over here
____END

    sys
        NOTICE::'additional augment point received'
            EXEC::page.flags.augmentMax++
        
    RESPONSES::akizet
        continue<+>END
            EXEC::change("PAGE!!goverride", true);vn.done();specialCam(false);pauseSwapCam(false)
`)

/********************* SFER SUPPLY */
/********************* SFER SUPPLY */
/********************* SFER SUPPLY */
//once the sfer vats room is clear
env.dialogues["s_vats"] = generateDialogueObject(`
start
    sourceless
        it is clear
            EXEC::change("PAGE!!smidclear", true);pauseSwapCam(true)
        i call back to the team to enter, and they file in to assess the room

    sourceless
        tozik approaches the vats, prodding at their sides and testing their connections
            EXEC::vnp({tozik:"show downright", bg: false })
    
    tozik
        the sfer vats are functional
        that is strange...
        the golems have fallen, the bodies of our kin are risen without clear connection
            EXEC::vnp({tozik:"show", bg: true })
        yet the vats, the doors... these mindless, stationary technical things are intact
        is mobility the common factor?
    
    akizet
        what about movefriend?
    
    tozik
        ah...
    
    gakvu
        no, that was different,
            EXEC::vnp({gakvu:"showleft far"})
        it was the groundsmind noticing our interference
    
____SHOWIF::[["PAGE!!goverride", true], ["PAGE!!bozcav", true]]
    cavik
        the groundsmind?
            EXEC::vnp({cavik:"showright far"})
        you have spoken to them??
    
    akizet
        it was hardly talking
        just more of the same signal
        sickness, feverish nonsense
____END

    sourceless
        suddenly, gakvu doubles over in pain
            EXEC::vnp({cavik:"hide", tozik: "hide", gakvu: "show"})
        she clutches her head in her claws
    
    tozik
        gakvu--?

    gakvu
        what is that?
        that noise...
        do you hear that?
        ugh
        velzie above is screaming into my mindcore
    
    sourceless
        gakvu looks around, then ahead at the room we have yet to explore
            EXEC::specialCam('g_s_bossdoor');pauseSwapCam(true);vnp({bg: false, gakvu: "downleft"})
        i do not hear anything...
        gakvu notices our confusion, turning her focus inwards
    
    gakvu
        i must be feeling it through my groundsmindry
        it is a dull signal...
        if i can feel it without a communicator, by simply approaching it...
        then it is <em>very</em> strong
    
    miltza
        ah!! i just turned my communicator on for an instant!
            EXEC::vnp({miltza: "show far", bg: true})
        no, i hear it too!
        it is the same signal as before, but it is like...
        it is the first part of it, over and over...
        do not enable yours, my friends
        it hurts...
    
    sourceless
        i need not test their assertions
        miltza clutches her face, enduring whatever it is she has exposed herself to
        she lowers her claws, a realization forming in her open receptors
    
    miltza
        no... wait... that is the noise!!
            EXEC::vnp({miltza: "show"})
        i heard that earlier, over and over, before you found me
        that is what has been disrupting all of our communications!
        or, at least, a part of it...
        maybe we can destroy it to restore clarity?
    
____SHOWIF::["PAGE!!goverride", false]
    itzil
        umm...
            EXEC::vnp({miltza: "show far", gakvu: "show far", itzil:"show far"})
        that is the storage room
        it only has a delivery golem for directing sfer, why would it...
        ah!! no, that is what geli was talking about!
        it uses dull microconnectors to send sfer around the spire instantaneously!
        maybe it is using that to broadcast that noise?
        we should stop it, definitely!!
        maybe i could even contact my kivii...
____END

    akizet
        well worth the try
            EXEC::vn.done()

____SHOWIF::[['PAGE!!mmidclear'],['PAGE!!smidclear'],['PAGE!!smcut', false]]
    sourceless
        suddenly, one of the side doors unlocks with a strange little musical chime
            EXEC::play('obeskToggle', 0.75);specialCam('g_s_shortcut')
        a familiar voice quickly follows...
    
    geli
        hello!! 
        i have detected all unauthorized entities,
        in BOTH manufacturing and sfer supply,
        have been removed from the premises!
        how did you manage that? ahaha!!
        i hope they did not argue with you too much!
        anyway i am opening the connective tunnel between these areas now!
        thank you!
    
    sourceless
        a small chime plays as it deactivates
            EXEC::setTimeout(()=>step(), 100);change('PAGE!!smcut', true);vn.done();
    
    akizet
        ah... thank you, geli
            EXEC::step()
____END
    
    akizet
        ah... thank you, geli
            EXEC::step()

    RESPONSES::akizet
        continue<+>END
            EXEC::specialCam(false);pauseSwapCam(false)
`)


env.dialogues["s_boss"] = generateDialogueObject(`
start
    sourceless
        the room twists maddeningly around the golem at its center
            EXEC::toggleBgm(env.embassy.music_unsafe_golems);ratween(env.bgm, 0.75);pauseSwapCam(true);specialCam('g_s_boss')
        whatever sfer storage it may have managed before is obscured by the light
        or--is it merely all gone? did it send it all somewhere?
        dull microtunnels flash in the air around the golem, sometimes even cleaving through itself
        this is remarkably dangerous
        but sure enough, now even i can hear the signal pulsing from it, over and over
        was the golem directed to do this? 
        or is it dull feedback from the microtunnels?
        no matter - we must destroy it, immediately
            EXEC::change("PAGE!!sboss", true)
    
    RESPONSES::akizet
        attack!!<+>END
            EXEC::env.embassy.startGolemFight('g_sboss', 's_bossclear')
            SHOWIF::['gameplay_off', false]
        bypass<+>CHANGE::s_bossclear
            SHOWIF::['gameplay_off', true]
            FAKEEND::(bypass combat)
        skip (debug)<+>CHANGE::s_bossclear
            SHOWIF::'TEMP!!debug'
`)

env.dialogues["s_bossclear"] = generateDialogueObject(`
start
____SHOWIF::'gameplay_off'
    sys
        ATTENTION::"thoughtform combat gameplay bypassed";'toggle within system menu if desired'
____END

    sourceless
        the golem's limbs cease their flailing,
            EXEC::env.stages['g_s_storage'].removeBoss(false)
        collapsing to the ground with enough force to sludge the false stone decorating the floor
        the tunnels are sealed now, too, and that terrible noise is distant once more, the dull lights fading
            EXEC::content.classList.remove('dullified');env.stages['g_s_storage'].normalize()
        we allow the peaceful silence to persist for a moment, before i call back,
            EXEC::toggleBgm(env.embassy.music_golems_cleared);

    akizet
        clear!

    sourceless
        the rest of the team enters the half-melted chamber,
            EXEC::env.embassy.music_unsafe_golems.rate(1)
        witnessing the sludged remains of our foe
        gakvu most of all seems to stand taller, receptors at ease
            EXEC::vnp({gakvu: "show far", bg: true})
    
    gakvu
        that is <em>so</em> much better...

    miltza
        and--it works!!
            EXEC::vnp({miltza: "showleft far"})
        we have forced away the claws of velzie, haha!
        i am getting clear enough communications, despite the damage
        the noise, it is still there... just distant
    
    akizet
        excellent
    
    sourceless
        funfriend - is it suitable enough to make some calls?
            EXEC::vnp({miltza: "hide", gakvu: "hide", hideStage: true})
        are you picking anything up?
    
    funfriend
        hello akizet!! yes!
        it is so much better now!
        at least in terms of functionality
        what i am hearing on open communication is still very bad
        however we can actually use it now!
    
    sourceless
        very good    
        i wave everyone closer
    
    akizet
        who among us has a working communicator, still?
        gakvu, tozik, i know yours were broken...
        mine is working, but it is part of my personal device
    
    sourceless
        which i certainly should not lend to anyone... not with my knowledge
        i make that clear enough in my tone, despite the receptors it earns me

____SHOWIF::'PAGE!!bozcav'
    akizet
        cavik, bozko?

    cavik
        mine is internal and also works!
        like yours, akizet
        bozko--you have an internal one too, right?
    
    bozko
        yes, it works still
    
    sourceless
        the ekivik aspiration for minimalism seems to have turned against them in this time
        but if only disconnected ones were sludged, then why did miltza's work?
        did she simply have it on a receptor when this all began?
____END
    
    akizet
        miltza, is yours still functional after that last exposure?

    miltza
        hmm...
            EXEC::vnp({miltza: "show"})
        oh, yes! i think it was damaged a little, but i can still use it!
        it is a standalone device, so--i can pass it around!
        which of you would like to use it first?

____SHOWIF::["PAGE!!goverride", false]
    karik
        perfect! neither itzil nor i have a communicator built into our minds
            EXEC::vnp({miltza: "show far", karik: "showleft far", itzil: "showright far"})
        itzil - you should use it first!
        then, tozik, gakvu, do either of you want to use it next?
        i can call my friend later

    itzil
        oh--thank you!
        yes, please!

    tozik
        absolutely
____END
    
    gakvu
        i am fine, it can wait until we stop this
            EXEC::vnp({miltza: "hide", karik: "hide", itzil: "hide", gakvu: "show"})
    
    sourceless
        gakvu is visibly perturbed, receptors twisted with confliction
        she does not speak up, but... i know her
        i think she does not trust miltza enough, maybe?
        or... is it who she wants to call that is the issue?
        she notices my staring, looking away and loosening her receptors again
        i thought i knew her well, but so much is coming to light...
        it is like i only walked upon her surface
            EXEC::vnp({gakvu: "hide"})
        miltza begins to pass her communicator around, unconcerned with herself
        i should try to contact someone, too...
    
    akizet
        ok
        let us make some calls
        but after that, we should resume with our plan
        weaponry, a body for the mindcores, and any survivors
        then, the beast in the way of the impressor...

    sourceless
        even with much of the supply missing, from whatever that golem was doing...
        with what remains, we can certainly create the things we need for our golem!
            SHOWIF::"PAGE!!mboss"
        with this, we could create something quite tough!
            SHOWIF::["PAGE!!mboss", false]
        
    sys
        NOTICE::'inventory addition';'knowledge of golem sfer';'key item for memory stream continuation'
            EXEC::addItem(env.ITEM_LIST["golem_sfer"], 1)
        NOTICE::'take to area';'greater vats';'to proceed'
            SHOWIF::'item|golem_parts'
        NOTICE::'locate other key items to proceed'
            SHOWIF::[['item|golem_parts', false]]
        NOTICE::'entity';'AKIZET';'additional ACT enabled';'call'
        RECOMMENDATION::'utilize perspective swap to examine'

    sys
        NOTICE::'additional augment point received'
            EXEC::page.flags.augmentMax++

    RESPONSES::akizet
        make a call now<+>CHANGE::s_calls
            EXEC::vn.done();specialCam(false);pauseSwapCam(false)
            HIDEREAD::
        later<+>END
            EXEC::vn.done();specialCam(false);pauseSwapCam(false)
`)

//'repeatable' call dialogue
//gordon's should only happen once, bozko/cavik should change based on having done it before
env.dialogues["s_callspeople"] = generateDialogueObject(`
RESPOBJ::
    RESPONSES::akizet
        gordon<+>gordon
            SHOWIF::["PAGE!!gordcall", false]
        cavik<+>cavik
            EXEC::change("PAGE!!callbc", true)
            SHOWIF::[["PAGE!!bozcav", false], ["PAGE!!callbc", false]]
        bozko<+>bozko
            EXEC::change("PAGE!!callbc", true)
            SHOWIF::[["PAGE!!bozcav", false], ["PAGE!!callbc", false]]
        kazki<+>kazki
        vekoa<+>vekoa
        family and collective<+>collective
        nevermind<+>END
            EXEC::vnp({hideStage: false});vn.done()
`)
env.dialogues["s_calls"] = generateDialogueObject(`
loop
    RESPOBJ::s_callspeople

start
    sourceless
        funfriend - activate communications
            EXEC::vnp({hideStage: true})
    
    funfriend
        ok!
        standing by!
    
    RESPOBJ::s_callspeople

gordon
    sourceless
        gordon...
        if the cousins have any involvement in this, he will know
        perhaps they can help us evacuate!
        funfriend - contact him!
        he should still have the dull communicator i gave him
        assuming it did not try to kill him...
    
    funfriend
        ok!!
        ...
        connection established!
    
    sourceless
        gordon's voice is distant
        he is strained - it sounds like he is running?
        i hear something fall and clatter on the ground
    
    gordon
        Damn it! Get back here!
        Hello? Akizet?
    
    sourceless
        gordon! are you all right??
    
    gordon
        Hold on, when you started calling, this thing...
    
    sourceless
        there is a loud scuffling against the auditory membrane
        
    gordon
        Ow! Little bastard...
        It crawled out of my pocket and ran away, and now it's stabbing me!
    
    akizet
        grasp it by the sides and crush the legs inwards!
    
    sourceless
        again comes the scuffle, and then a series of cracks
        the connection wavers slightly - gordon sighs

    gordon
        That's better.
        Akizet, I just got off a half dozen other calls.
        They sent a probe.
        They did it. Those fuckers--sorry--they completely went over our heads.
        I know, I promised you--I even had assurances from <em>everyone</em> above me.
    
    sourceless
        what is he implying?
        did he...
        œ›¤€ù
        Uþfâ!!
        i nearly double over out of anxiety, my receptors crushing into themselves
    
    gordon
        Even worse is that they waited to tell me. I don't know how long it's been.
        The reports I've been getting, I-I don't even know...
        Polygonation spires collapsing, your ships spiralling out of control, it's--

    akizet
        gordon--!!
    
    sourceless
        no, no, no
        this cannot be because of us...
        because of <em>me</em>
        his voice changes, realizing from my tone that it is even worse than he can know
        growing quieter, more fearful, more like mine

    gordon
        ...
        Akizet, what is going on? What is all this?

    akizet
        you promised! you said...
        youîŸ~F£ßpÛ¿)Fû§f>ñ6

    sourceless
        i do not breathe, yet i am strangled
        for this instant, it is like i am screaming into my own head
        no coherent words reach gordon

    gordon
        Shit, I know. I know, I know, I know.
        But it doesn't work that way for us, Akizet.
        We can't just hide things like this. I know I told you I would keep it quiet...
        But there were certain people I had to tell, and I didn't want--
        ...

    sourceless
        the signal degrades further, and i hear another crack as he struggles with the communicator
        he speaks, but his words are lost, a strange and familiar murmur overpowering them
        ...if this is not the groundsmind's work...
        did it come from the source? did the probe do something?
        before i can convey my thoughts, his voice comes back into focus
    
    gordon
        Look, they all promised me the same thing. I trusted them, too.
        But someone took what we found and ran it even higher up.
        We still have the Storm, but once they had the coordinates...
        Someone got scared. That's all it took.
        They're not telling me what happened down there. I don't even know if they know for sure.
        But whatever it was, it's bad.
        Akizet--<em>what</em> is happening? Where are you?
        Do you need help?

    sourceless
        i pace urgently, no longer caring to be mindful of how i appear
        the others are equally as distraught anyway
        my thoughts flood the communicator, overlapping with one another in a wave
    
    akizet
        a signal overcame everything, it knocked me and my team unconscious
        all of our constructs now turn upon us, killing us--
        gordon... you must tell them, get away from the embassy!
        you must tell them to escape - everything is falling apart!!
        and your probe... if anyone is still near,
        they must escape <em>immediately!</em>
        and please know, if anything is attacking your people, it is not us!
        it is not us!!!
    
    sourceless
        ...
        ...
    
    akizet
        gordon??
    
    funfriend
        akizet...
        i cannot discern anything from gordon's communicator anymore
        there is only that noise
    
    sourceless
        °H]•
        my receptors tremble with guilt
        is this all happening because of me...?
        no, no--the conflict is at the core of this, i know it
        and--gordon!! he is not without blame!!
        i trusted him... he said he would listen
        ...
        i cannot bear this
        but if i crumble now, it is like succumbing to fear paralysis on the surface
        curling up and awaiting certain death, abandoning those i could save...
        no - fault cannot be decided now
        the only option we have is to continue fighting and save what remains
        ...
        funfriend
        i need you to compartmentalize this conversation
    
    funfriend
        akizet...
        you made me promise not to let you self-modify
        ...are you sure?
    
    sourceless
        i am frozen with indecision
        the others, thankfully, are distracted from me at the moment...
        no... no, i cannot even consider this
        you are right, funfriend
        i should have listened to you to begin with
    
    funfriend
        it is ok akizet
        we will survive
        look at how well you have led everyone!
        you can do this!!
            EXEC::change("PAGE!!gordcall", true)
    
    RESPONSES::akizet
        we will see<+>loop
            FAKEEND::(back)

cavik
    sourceless
        cavik...
        we need to know if he is still in the spire at all
    
    funfriend
        ok!!
        ...
        connection established!

    akizet
        cavik!
    
    cavik
        akizet...?
        you got through?
        it is so clear now!
    
    sourceless
        i nearly fall over from the relief
        the thought of cavik dead from this...
    
    cavik
        akizet, where are you? we can come get you!
    
    akizet
        what? what do you mean?
        we? how many do you have?
        you have a way around too?
    
    cavik
        what - do you?
        um, we have been using the archival tunnels
        most are still connected, despite the veins collapsing!
        and bozko has been taking care of all the golems!

    sourceless
        with what...?
        we have the only timestopper in the embassy
    
    cavik
        he is ok... physically... it is impressive how he has dealt with them
        honestly, he is not really doing so well otherwise
        it has been brutal
        but he is leading us down regardless
        ...there used to be more of us, 
        but now it is just me and bozko
    
    akizet
        down? what? why?
        hold on - cavik, i have gakvu, tozik, and some others
        we are in golem maintenance, down from our research segment
        we intend to stop the groundsmind
    
    cavik
        us too!
        listen - we will meet you soon!
        we are nearly down to maintenance ourselves
        i will tell bozko!
        but i need to go - there are more coming...
        be careful!
        
    akizet
        you as well, my friend
    
    sourceless
        if they are fighting, bozko will be too busy to call...
        we will simply have to watch for them
            EXEC::change("PAGE!!callbc", true)
    
    RESPONSES::akizet
        stay safe, my friends<+>loop
            FAKEEND::(back)

bozko
    sourceless
        bozko...
        we need to know if he is still in the spire at all
    
    funfriend
        ok!!
        ...
        connection established!

    akizet
        bozko!
    
    sourceless
        an immense weight of dread floods through the connection
        not from me calling - but persistently, like from a responsibility
        bozko... what has he seen...?
    
    bozko
        akizet
        where are you?
        are you hurt?
    
    akizet
        bozko, i have gakvu, tozik, and some others from our floor
        we are all in golem maintenance, heading down to stop the groundsmind
        what about you - are you ok?
        have you seen cavik?
    
    bozko
        yes
        cavik is with me
        there were some others, but...
        ...
    
    sourceless
        no concept needs to be formed
    
    bozko
        ...we are heading down for the exact same reason
        the archival tunnels are still mostly intact
        we occasionally need to detonate some to open blocked paths,
        but they serve well enough in our descent
    
    akizet
        what!!
        what about the golems?
        it is only with the help of the timestopper we have been able to...
    
    bozko
        they are not a problem
    
    sourceless
        something about him is different - he is even shorter in tone
        i cannot measure what trauma he carries, but it is beyond that
        he has altered himself, somehow
    
    bozko
        we are nearly to golem maintenance ourselves
        i will let cavik know you called
        he will be relieved to know you are all right
        as am i...
        
    akizet
        bozko, did you... did you do anything to yourself?
    
    bozko
        akizet... i...
        no--i will explain when we are there
        i must focus
        more of these surface-sent golems are coming
    
    akizet
        please be careful!!
    
    sourceless
        the connection ceases
        if they are fighting, cavik will be too busy to call...
        we will simply have to watch for them
            EXEC::change("PAGE!!callbc", true)
    
    RESPONSES::akizet
        stay safe, my friends<+>loop
            FAKEEND::(back)

kazki
    sourceless
        kazki...
        i think she was out of the spire this gaze
        or, 'day' would be more accurate, given her schedule...
    
    funfriend
        ok!!
        ...
        ...
        akizet, when i try to call her...
        it is like that noise you stopped - it is overpowering!!
        i do not know why, but something is stopping me from reaching her
    
    sourceless
        what does that mean?
        is she in the embassy?
    
    funfriend
        i do not know akizet!!
        it does not sound like anything i can hear in the embassy!
    
    sourceless
        peculiar
        velzie, guide her to us again...
    
    RESPONSES::akizet
        ...<+>loop
            FAKEEND::(back)

vekoa
    sourceless
        vekoa!
        maybe we can try and get an explanation?
    
    funfriend
        ok!!
        ...
        ...
        ...
        no...
        nothing
        i cannot even locate her communications signature
        her device must be destroyed!
    
    sourceless
        *´«:
        i hope she is not behind this...
    
    RESPONSES::akizet
        a vel's luck<+>loop
            FAKEEND::(back)

collective
    sourceless
        can you call my sister rouzesche?
        is the contrivance even intact, still?
    
    funfriend
        let me try!!
        ...
        ...
        we are not cut off, but... the collective... 
        it is impossible to locate anything in it right now!!
    
    sourceless
        could the signal have gone as far as obeski...?
    
    funfriend
        it is technically a dull signal like any other!!
        however!
        given the strength that it is hitting you and everyone else with
        i feel this is a targeted attack!
        if it reached obeski, i do not think it would have the same effect...
        but they would certainly be able to hear it!
    
    sourceless
        that is just hopeful thinking, funfriend
        but i suppose that is your purpose
        i will accept this for now
    
    RESPONSES::akizet
        ...<+>loop
            FAKEEND::(back)
`)

/********************* OPERATIONS */
/********************* OPERATIONS */
/********************* OPERATIONS */
env.dialogues["ops_bozcav"] = generateDialogueObject(`
start
    sourceless
        as we step into the main hall once again, 
        the ground trembles--a rumble from above!
        is it another vein collapse? we back up, ready to escape into the room behind us
        no, no--it was too quick, too quiet... like the directed detonation of a kavruka
        ...
        another!!! the ceiling gives way, letting forth the blood of the spire
        at first it is one hole, then it keeps going as parts of an archival vein collapse through the ceiling
        an archival golem lands in the sludge, still alive, but is crushed by debris before it can engage us
            EXEC::vnp({agolem: "show downed", hideStage: true})
        then... it is quiet, the operations hall lit by the dazzling archival lights
        this was another directed destruction...
        who...?
    
    cavik
        we are good!
    
    sourceless
        cavik!!
        he drops down from above, landing atop the sludgy debris with a splat
            EXEC::vnp({cavik: "show far", hideStage: true})
    
    akizet
        cavik! you are alive!!
    
    sourceless
        at the first sound, he turns to us with aggression, but it fades instantly
        what is that he nearly threw at us? it has such a thin shell
        oh--he is carrying a number of improvised explosives...
    
    cavik
        akizet!
            EXEC::vnp({cavik: "show"})
        is everyone all right...? 
        when we could not find you above, we thought the worst...
    
    sourceless
        i almost run to embrace him, for perhaps the first time in our deaths
        with the bright lights from above forcing our eyes to adjust...
        it is too late for me to notice what has risen in the darkness behind him
            EXEC::changeBgm(env.embassy.music_unsafe_golems);vnp({agolem: "show attacking"})
        that same archival golem, its hardy fists glimmering as they reach out...
    
    akizet
        cavik, behind--!!
    
    sourceless
        i activate the timestopper by reflex, as i have so many times now
            EXEC::ratween(env.bgm, 0.65)
        but i do not think any of us can reach him in time
        he is there, frozen, staring at me,
        as a sharpened golem limb sails for his chest
    
    timestopper
        what do we do?
        akizet?
    
    RESPONSES::akizet
        there is nothing<+>accept
    
accept
    timestopper
        i do not think there is anything we can do
        even if we all ran...
        it would be too late
        cavik has a heart-placed mindcore
        our connection seems weaker now - is it still moving??
    
    sourceless
        =gEºÐ¼H
        cavik...
        ...i must not let anything go unsaid
        funfriend...
        we must send him a message
        queue the following, then establish a connection
    
    funfriend
        akizet,
        i do not think he will have any time to process--
    
    sourceless
        funfriend: listen now and then do it, no matter what
        ...
        cavik
            EXEC::vnp({cavik: "show"})
        ¶ÔüA, what do i say?!
        how far is it that we have traveled together??
        from our failures in our lives, to our strides in death
        you have been there since the beginning,
        and even with our stumbles and endless fountains of mutual forgiveness...
        i feel i must apologize again
        all of this - it is my fault...
        how many times have i failed you now?
        ...
        i was afraid, cavik, we...
        no, no, it is so long ago now
        is my sorrow to be your final thoughts? i cannot let it be this
        your imagination, the boundless joy and energy you found in death...
        whatever is lost in all of this, you are what i will miss, most of all
        i hope you can find it all again behind velzie's stage
        hehe, but, i know...
        velzie never lets us walk away so easily
        we will see each other again
        until then, my friend
        ...
        this message suffices, there is no time for any more
        it will be all the closure i can afford
        i flex the nerve of the timestopper again, and i feel shared confusion as it deactivates
            EXEC::ratween(env.bgm, 1)
        the others have no idea what i have done

    cavik
        aki--?
    
    sourceless
        he is turning, barely able to complete a syllable before--

    sourceless quiet
        i turn away, and there is a great thud, a squelch
            EXEC::play('stab', 0.75);vn.fadeChars(true);
        followed by a few other splatters...
            EXEC::play('stab', 0.5)
        my receptors are twisted into one another,
        the sharpest sorrow i have ever known piercing my heart
        and it will not be long before i have vengeance
            EXEC::vnp({agolem: "hide"})
    
    cavik
        akizet... you...
    
    bozko
        i told you not to go ahead of me
        that one was still intact
            EXEC::vnp({cavik: "show", bozko: "show"})

    sourceless
        what...
        when i turn back, i see that cavik is staring down at what remains of the golem
            EXEC::vn.fadeChars(false);changeBgm(env.embassy.music_golems_cleared)
        then, he brings that stare back up to me, speechless...
        but most of all, unharmed
        behind him is bozko, who had just dropped down...
        and smashed the golem before it could...
        ...
        funfriend, did that message get sent?
    
    funfriend
        yes, akizet!!
        sorry, did you not want me to...?
    
    sourceless
        no, i...
        bozko waves one of his gauntlets to rid it of viscera
    
    bozko
        still, good work, this vein was a clean detonation
        akizet, it is good to see you are still all together
        what is the situation?
    
    sourceless
        i am unable to respond, locked in shock with cavik
        the tangle of my receptors becomes undone, slowly
        he is not saying anything...
        there are no tears within us to be shed in our deathly forms
        after the prolonged silence, bozko glances between me and cavik, then the others
        my eyes break from cavik, allowing my mind to breathe again
        i must say something

    akizet
        ...the timestopper has been helping us survive
        we are trying to get to the groundsmind to stop all of this madness
        but we need weapons, and a body for two of the mindcores we have saved
        this tendril has...
    
    sourceless
        the weight of what i have just transferred strikes me once more
        i truly thought he was gone...
        do i simply carry on...?
        yes--i will simply talk to him later, that is all
        already the sorrow is fading, regardless
        this is one of your cruelest jokes, velzie
        i can hear your cackle
    
    akizet
        ...it, has a number of archival cores and connections we can use to find schematics
        after that, we intend to destroy a large golem in the way of an impressor
        we can use that to set you and cavik up with timestopper connectors
    
    sourceless
        i find my heart again

    akizet
        and then we will be unstoppable
    
    bozko
        all right
    
    sourceless
        i expect the subtle twist of his receptors whenever he is about to say something clever
        he always knows what to say...
        like kazki, he is practically a vel at heart
        but...
        there is none of that here
        a terrible darkness looms over him
    
    bozko
        we are here to help
    
    cavik
        ...yeah!
        we will get through this!
    
    sys
        NOTICE::'additional party members';'CAVIK';'BOZKO';'now available'
            EXEC::env.embassy.addPartyMember("bozcav")

____SHOWIF::"PAGE!!augments"
        NOTICE::'additional augments enabled for new party members'
        NOTICE::'alter party member abilities via augment menu'
        NOTICE::'contained within party menu';'Z'
____END

    RESPONSES::akizet
        we should keep moving...<+>END
            EXEC::change("PAGE!!bozcav", true);vn.done()
`)

env.dialogues["ops_boss"] = generateDialogueObject(`
start
    sys
        WARNING::'degraded visual profile'
            EXEC::specialCam('g_o_boss');pauseSwapCam(true)
        ANALYSIS::'missing resources causing low cohesion'

    sourceless
        within this final chamber are countless bright relics
        their electric boxes, most active and displaying intercepted images
        the noises they emanate are near deafening...
        but most pressing of all is the great processing core across from us
        it is in its own echo of a mind - not yet perceiving us as it should
        its many floating secondary observational cores normally would be focused upon the boxes, i think...
        but now, they simply spin and pulse nothing of any meaning
        from the core itself comes an incomprehensible babble...
    
    translation core
        <span definition="ERROR::'missing resources'">█████ ██</span>
        <span definition="ERROR::'missing resources'">███? ███??</span>
        <span definition="ERROR::'missing resources'">██████████? █████??</span>

    sourceless
        ...strange, yes, but...
        is it a problem?
        i do not think it could hurt us if it tried
        except for maybe directing the spheres to strike us
        but none are raised against us, even as we slowly approach
    
____SHOWIF::"pa|tozik"
    tozik
        this is a translation core
        ...what is it doing?
____END
    
____SHOWIF::"pa|gakvu"
    sourceless
        i turn to see what gakvu thinks
        she is wincing, receptors twisted in pain
    
    gakvu
        ugh... i tried to connect to it
        its mind is burning acid, like hearing that signal again...
        what should we do?
____END
    
____SHOWIF::"pa|cavik"
    cavik
        fascinating...
        it is affected by the signal, but,
        i think it is trying to process it rather than obey it
____END
    
____SHOWIF::"pa|miltza"
    sourceless
        miltza shuffles along the edge of the spherical chamber,
        trying to check behind the screens
        for survivors, i assume--or perhaps hidden golems
____END

    akizet
        it is not actually attacking, so...
            EXEC::content.classList.add('painprep', 'painfade')
    
    translation core
        <span definition="ERROR::'missing resources'">█████ ████ ████ ███ █ ██</span> <span definition="ERROR::'missing resources'">█████ █████████ ███ █████</span>
        <span definition="ERROR::'missing resources'">████ ██ ███ ██ ████ █████ ███ ██</span>

    sourceless
        suddenly, pain
            EXEC::env.embassy.day3Signal(3000)
        
    sourceless quiet
        one of the words it just spoke pierced my mind,
            EXEC::content.classList.add('slowpain')
        and again, the signal's message is made clear
        hunger... loss... return...
        fØ¬»
        the others feel it too in one united pained reaction
        i instruct my qou-body to cease audible reception, but...
            EXEC::content.classList.remove('painmode', 'painhalf', 'painfade')
        i still hear it...?
            EXEC::ratween(env.bgm, 1, 3000)
        the corrucystic components that are supposed to not be listening,
        they are still picking it up, becoming incoherent simply by exposure...
    
    timestopper
        what do we do?
        destroy it!
        no, run!
        wait - but it is turning the signal itself into something audible
        whatever it is learning, it is too dangerous!
            EXEC::change("PAGE!!obosslearn", true)

    sys
        NOTICE::'optional memory segment'
    
    RESPONSES::akizet
        skip (debug)<+>CHANGE::ops_bossclear
            SHOWIF::'TEMP!!debug'
            EXEC::change("PAGE!!oboss", true);specialCam(false);pauseSwapCam(false)
        attack!!<+>END
            FAKEEND::(fight)
            EXEC::change("PAGE!!oboss", true);env.embassy.startGolemFight("g_oboss", "ops_bossclear");specialCam(false);pauseSwapCam(false)
            SHOWIF::['gameplay_off', false]
        bypass<+>CHANGE::ops_bossclear
            SHOWIF::['gameplay_off', true]
            EXEC::change("PAGE!!oboss", true);specialCam(false);pauseSwapCam(false)
            FAKEEND::(bypass combat)
        run!!<+>run
            HIDEREAD::
            EXEC::change("PAGE!!obossrun", true);specialCam(false);pauseSwapCam(false)

run
    timestopper
        we should escape
        it is not mobile and not aware
        yes - it will destroy itself!

    sourceless
        we quickly turn back, escaping into the hall
        yes, we do not need to fight this thing, it is true...
        but it feels wrong to leave such a dangerous creature
        what if bozko and cavik had found it before us?

    sys
        NOTICE::'optional memory segment'
    
    RESPONSES::akizet
        escape<+>END
            EXEC::changeStage("g_o_hall2", 59, 'down');specialCam(false);pauseSwapCam(false)
`)

env.dialogues["ops_boss_return"] = generateDialogueObject(`
start
    sourceless
        we return once more
            EXEC::specialCam('g_o_boss');pauseSwapCam(true)
        as we should - it is not right to leave this here
        it could be broadcasting this, for all we know...
    
    RESPONSES::akizet
        skip (debug)<+>CHANGE::ops_bossclear
            SHOWIF::'TEMP!!debug'
            EXEC::change("PAGE!!oboss", true);specialCam(false);pauseSwapCam(false)
        attack!!<+>END
            FAKEEND::(fight)
            EXEC::change("PAGE!!oboss", true);env.embassy.startGolemFight("g_oboss", "ops_bossclear");specialCam(false);pauseSwapCam(false)
            SHOWIF::['gameplay_off', false]
        bypass<+>CHANGE::ops_bossclear
            SHOWIF::['gameplay_off', true]
            FAKEEND::(bypass combat)
        run!!<+>run
            HIDEREAD::
            EXEC::change("PAGE!!obossrun", true);changeStage("g_o_hall2", 59, 'down');specialCam(false);pauseSwapCam(false)

run
    timestopper
        still too dangerous!

    sourceless
        we quickly turn back, escaping into the hall
        yes, we do not need to fight this thing, it is true...
        but it feels wrong to leave such a dangerous creature
        what if bozko and cavik had found it before us?

    sys
        NOTICE::'optional memory segment'
    
    RESPONSES::akizet
        escape<+>END
            EXEC::specialCam(false);pauseSwapCam(false)
`)

env.dialogues["ops_bossclear"] = generateDialogueObject(`
start
____SHOWIF::'gameplay_off'
    sys
        ATTENTION::"thoughtform combat gameplay bypassed";'toggle within system menu if desired'
____END

    sourceless
        with its outer shell damaged enough,
            EXEC::env.stage.current.removeWordfriend()
        a well-placed strike is all it takes to destroy its echo
        and thus, its purpose is lost, its components clattering to the false-stone below
        it still hurts when i think about what it said...
        but it is not so bad as a memory instead
        funfriend, can you compartmentalize it for me?
        this is a self modification i can abide
        i did not know simple audible arrangements could cause incoherence...
    
    funfriend
        you got it akizet!
        all done!
        although... i do not know how long we can actually store it!
        it is already eating away at the...
    
    sourceless
        then delete it, before it is upon us again
    
    akizet
        everyone...
        destroy what you just heard
        it makes the pain stop
    
    sourceless
        they look at me strangely
        like a self-modifier made clear
        i do not care - these words were not meant to be heard
        i call back down the hall for everyone to come, and so they do
        gakvu is drawn to the corpse of the translator
            EXEC::vnp({gakvu:"show far", hideStage: true})
    
    akizet
        careful...
    
    gakvu
        yeah, i know
        but look
    
    sourceless
        gakvu fishes out one of the memory cysts it had been storing its findings upon
        it comes nowhere near either of her receptors, though
    
    gakvu
        we could use this as a weapon
            EXEC::vnp({gakvu:"show"})
        think about it...
        if it causes pain in us, maybe it can cause pain in our foes
        we just need a projector
    
    tozik
        gakvu, you risk exposing yourself to it
            EXEC::vnp({tozik:"showleft far"})
        even with directed projection, it is reckless
    
    miltza
        we should destroy it!!
            EXEC::vnp({miltza:"showright far"})
        imagine if it reached the collective...
    
    gakvu
        as fire burns, does it not remove itself?

    cavik
        this is true!!
            EXEC::vnp({miltza:"hide", tozik: "hide", cavik: "show"})
        i have been tracking the effects of the signal with a backup communicator since this started...
        my main one is internal and still works, but i had this separate one, because, ah
        oh, it does not matter, but the external one was damaged by the signal!
        it no longer functioned - but i held it anyway, to see if i could repair it later...
            EXEC::vnp({cavik: "focus"})
        eventually, it started to emanate the oddest noise, something like the signal itself
        but when that second wave came, it... stopped! and started to melt completely!
        what this means exactly, i am not sure... 
        but it had low processing capability, and i suspect it could not handle the signal's meaning
        gakvu, if you wielded the signal, amplified and directed, 
        i imagine it could destroy these golems like nothing else!

    gakvu
        akizet, what do you think?
            EXEC::vnp({cavik: "defocus"})
    
    sourceless
        gakvu waves the cyst around,
        her receptors still carrying a playful tilt
        how does she stay so high-spirited?
    
    akizet
        we will keep it
        whether as a weapon, or as something for study
        just... do not connect to it directly if you do not need to
            EXEC::addItem(env.ITEM_LIST['core_translation'], 1)
        
    sys
        TEXEC::\`NOTICE::'received <span definition="INHERITED CONTEXT::\${env.ITEM_LIST['core_translation'].description}">\${env.ITEM_LIST['core_translation'].name.toUpperCase()}</span>'\`

    sys
        NOTICE::'additional augment point received'
            EXEC::page.flags.augmentMax++
    
    RESPONSES::akizet
        keep moving<+>END
            EXEC::vn.done()
`)

/*******************LOBBY BOSS DOOR*/
/*******************LOBBY BOSS DOOR*/
/*******************LOBBY BOSS DOOR*/


env.dialogues["lobby_bossdoorops"] = generateDialogueObject(`
RESPOBJ::
    RESPONSES::akizet
        examine<+>early
        proceed<+>proceed
            SHOWIF::[["PAGE!!goverride"], ["PAGE!!ikgolem"], ["PAGE!!bozcav"]]
        (debug) force proceed<+>proceed
            SHOWIF::'TEMP!!debug'
        nevermind<+>END
    
    RESPONSES::sys
        save iteration<+>save
            SHOWIF::[["PAGE!!goverride"], ["PAGE!!ikgolem"], ["PAGE!!bozcav"]]
            HIDEREAD::
        
`)
env.dialogues["lobby_bossdoor"] = generateDialogueObject(`
loop
    RESPOBJ::lobby_bossdoorops

save
    sys
        ATTENTION::'saving iteration...'
        ...
            EXEC::env.embassy.collapseSave({effects: true})
            WAIT::1000
        NOTE::'save process complete'

    RESPOBJ::lobby_bossdoorops

start
    sourceless
        we approach the great door
        its components are melted, fused into one another
        parts have bulged outwards from blunt trauma within
        dead metal reinforcements jut out from particularly damaged areas
        we will need to repair it and be ready before we can enter
            SHOWIF::["PAGE!!goverride", false]
        we ought to see if we can build a formidable golem to fight it before we enter
            SHOWIF::[["PAGE!!goverride"], ["PAGE!!ikgolem", false]]

____SHOWIF::[["PAGE!!goverride"], ["PAGE!!ikgolem"], ["pa|ikgolem", false]]
        we can enter and face the danger within - karik will probably be fine even without a timestopper

____SHOWIF::[["PAGE!!goverride"], ["PAGE!!ikgolem"], ["pa|ikgolem"]]
        we have what we need to face the threat within, i think... we could proceed if everyone is prepared

____SHOWIF::["PAGE!!bozcav", false]
        ah--there is also the matter of the operations tendril...
        what if there are survivors in there?
        it is unlikely, given this chaos,
        but i cannot leave anyone behind
____END

____SHOWIF::[["PAGE!!goverride"], ["pa|ikgolem"], ["PAGE!!bozcav"]]
    sys
        ATTENTION::"current memory stream near conclusion"
        ADVISE::"save iteration"
____END

    RESPOBJ::lobby_bossdoorops

` + /* reaching the door before repairing or getting the IK golem */ `
early
    akizet
        why would the door still hold after such damage?
        it is large enough that it should simply sludge and reveal its path...
    
____SHOWIF::'PAGE!!ikgolem'
    sourceless
        karik hovers closer in their golem, also curious

____SHOWIF::['PAGE!!ikgolem', false]
    sourceless
        karik skitters closer, also curious
        they clamber up the wall nearby, examining the way it merges with the false-stone
____END
    
    karik
        ah!
        this is an uncommon design, but i have seen it used within some other segments
        akizet, it is holding because it is load-bearing for its chamber!
    
    tozik
        why?
        that is a terrible idea
    
    karik
        well, it simplifies the structural needs of chambers it is attached to
        it is quite useful for such large rooms!
        there are extremely resilient dead metal implements within them for this very purpose
        of course, it is very unsafe in the event of collapse,
        for it simply becomes a wall...
        but such occasions within a spire were only theories, until now
        and besides - who would ever think the groundsmind herself would abandon us?
        a bad idea now, but reasonable within our known safeties
    
    akizet
        vekoa would not abandon us, do not entertain the thought
        after everything...
        regardless, thank you for your knowledge, my friend
    
    RESPOBJ::lobby_bossdoorops

proceed
    sourceless
        with itzil and karik ready to fight, i feel that we are prepared
        the body we have created for them should be able to match our foe
    
    akizet
        is everyone ready?

    gakvu
        keep velzie entertained for us, everyone
            SHOWIF::'pa|gakvu'

    miltza
        i will do my best!!
            SHOWIF::[["pa|miltza"], ['aug|drone']]
        i... i will do my best!
            SHOWIF::[["pa|miltza"], ['aug|drone', false]]

    bozko
        let us have it over with
            SHOWIF::'pa|bozko'

    cavik
        yes!
            SHOWIF::'pa|bozko'

    tozik
        with karik's golem body, this should be trivial
            SHOWIF::'pa|tozik'

____SHOWIF::["pa|ikgolem", false]
    karik
        even without a timestopper, i will help!
        this body should still prove effective
____SHOWIF::["pa|ikgolem"]
    karik
        ready!!
____END

    akizet
        geli, unlock the doors
        gakvu repaired them with the override, but left them locked
        it is time for us to face this beast
    
    geli
        ahaha! ok!
        i will keep velzie entertained for you
    
    sourceless
        a ripple passes over the surface of the doors
            EXEC::change("PAGE!!bosslock", true)
        it is open, now
            EXEC::step()
    
    RESPONSES::akizet
        enter<+>END
`)

env.dialogues["boss"] = generateDialogueObject(`
start
    sourceless
        advanced operations...
            EXEC::pauseSwapCam(true);specialCam('g_boss');toggleBgm(env.embassy.music_unsafe_golems);ratween(env.bgm, 0.5)
        the walls are warped from the damage, some parts still trying to resemble stone
        there may have been qou here once, but everything left unarmored is sludged...
        the source of the damage is before us - a multipurpose deep-sea constructor
        its body is angular and appendages bulbous, designed to withstand the greatest of pressures
        within its gauntlets are countless tools, marred by its raging against its containment
        once complex implements, now indistinct and dull
        is it truly angry? or is it a reflection of the signal?
        regardless - its targeting optics locate us quickly
        we cannot let it make the first move
            EXEC::change("gboss", true)
    
    RESPONSES::akizet
        preview boss clear<+>CHANGE::bossclear
            SHOWIF::'TEMP!!debug'
        attack!!<+>END
            EXEC::env.embassy.startGolemFight('g_boss', 'bossclear')
            SHOWIF::['gameplay_off', false]
            FAKEEND::(fight)
        bypass<+>CHANGE::bossclear
            SHOWIF::['gameplay_off', true]
            FAKEEND::(bypass combat)
`)

env.dialogues["boss_tut"] = generateDialogueObject(`
start
    sourceless
        the foundation golem raises its spherical gauntlets
            EXEC::ratween(env.bgm, 0.75)
        each of them easily nearly the size of a newborn veilk's eye
        with fists like that... it would simply crush any of us
        ...except, of course, karik and itzil!!

____SHOWIF::["pa|ikgolem"]
    sourceless
        i reach out through the timestopper...

    akizet
        karik! take the lead!
        those columns of dull light - whatever component they were,
        it is clear they are now malfunctioning...

    karik
        ah ha ha! i see!
        yes, i will knock this beast into them!
    
    akizet
        no, i was--i was going to say avoid them
        but...
        yes! do that! you could break its assault that way!
        listen to my instructions carefully...
    
____SHOWIF::[["pa|ikgolem", false]]
    sourceless
        in our stilled time, i observe their golem
        itzil asleep within, but karik, a kiv, directing the body
        yes, they will surely know what to do
        i instruct the timestopper to release the flow of time for an instant to call out,
    
    akizet
        karik!
    
    sourceless
        in an instant, their eyes lock with mine, then the beast,
        their floating gauntlets immediately moving to intercept
        with an impulse, the timestopper seizes the flow again
        with this advantage, i can call out instructions to karik...
____END

    sourceless
        i can see in how it hovers - it is clumsy...
        a <span definition="INHERITED CONTEXT::'derogatory';'incompetent fighter'">kelnit</span>, stepped into a spar for the first time...
        i may be able to predict some of its moves

    sys
        WARNING::'abnormal thoughtform activity detected'
        WARNING::'entity FOUNDATION GOLEM';'altering thoughtspace'
        ANALYSIS::'intention to destroy recollection locus'
        EXECUTING::'structure enforcement'

____SHOWONCE::
    moth
        wait, didn't it just tell you to use a proxy last time?
        what's going on?
____END
    
    sys
        ATTENTION::'utilizing structure':'MELEE'
            EXEC::page.melee.tutorialStep()
        ATTENTION::'neural controls adjusted';'command menu enabled'
            EXEC::page.melee.tutorialStep()
        NOTICE::'enqueue two actions for ally to enact';'foe will select two options'
        NOTICE::'either entity being knocked into DULL COLUMN will end round'
        EXECUTING::'action list'
        STRIKE::'stationary punch';'stave off enemy advance'
            EXEC::page.melee.tutorialStep()
        ADVANCE::'forward movement';'attack enemy on contact'
            EXEC::page.melee.tutorialStep()
        GUARD::'stationary defense';'steal attack charge if enemy wound up'
            EXEC::page.melee.tutorialStep()
        WIND UP::'move back one space and charge attack';'improves ADVANCE, STRIKE'
            EXEC::page.melee.tutorialStep()
        WARNING::'winner of evenly matched attacks decided randomly'

____SHOWONCE::
    self
        what does that mean
        how does this work
        did your friend include a manual
    
    moth
        lol no
        still, there's only four actions, how hard can it be?
        besides, didn't it only get hard last time when that bastard showed up?
            SHOWIF::"item|sorry_cyst"
        just hit stuff, it'll work out
____END

    RESPONSES::akizet
        fight!!<+>END
            EXEC::page.melee.tutorialStep();ratween(env.bgm, 1)
            FAKEEND::(begin melee)
`)

env.dialogues["boss_half"] = generateDialogueObject(`
start
    sourceless
        in our foe, i see something change
        across its dense chassis are myriad impact marks, bleeding sludge
        it hunches like a wounded predator...
        desperate now, more deadly
        we will need to plan more carefully

    akizet
        karik!! listen to me carefully!
    
    sys
        NOTICE::'instruction queue lengthened to 3'
        NOTICE::'3 commands now required to proceed'

    RESPONSES::akizet
        fight!!<+>END
            FAKEEND::(continue fight)
`)

env.dialogues["boss_laststand"] = generateDialogueObject(`
start
    sourceless
        the golem is crumbling
        it is nearly done - we are so close to the power we need
        but the dull columns have grown unstable, disrupting the timestopper's effectiveness
        some portion of them thrashes and spins out of control within the dull plane, plucking at our connection
        we have to stop this now while we have the advantage
    
    akizet
        karik!! one more time!
    
    sys
        NOTICE::'KO enemy once to destroy them'

    RESPONSES::akizet
        fight!!<+>END
            FAKEEND::(begin melee)
`)

env.dialogues["boss_closeout"] = generateDialogueObject(`
start
    sourceless
        the golem is forced into the destructive column one last time
            EXEC::ratween(env.bgm, 0.5, 10000)
        its fists are little more than melted blobs of sludge now
            EXEC::env.stages['g_boss'].hideBoss();
        they fall away, unable to endure any more damage - and it is finally without defense
        karik rears the great fist of their golem, warping its fingers into long spikes
        or... is that itzil? awakened in battle?
        i think i hear itzil screaming, or maybe karik - perhaps both of them, it is hard to tell now
        unable to block any more, the constructor's head is skewered
            EXEC::page.melee.fakeAttack()
        whatever intelligence it had is pierced, causing the rest of its body to fall limp,
        the impact enough to briefly tilt the chamber
        i nearly celebrate, but watch on as itzil and karik slam the head into the ground,
            EXEC::page.melee.fakeAttack()
        smashing it with their other fist, over and over...
            EXEC::page.melee.fakeAttack()

    akizet
        karik--?
        itzil?
    
    itzil
        ZP”cQàá!!
            EXEC::page.melee.fakeAttack()
        *u0ôjÇ!!!!! õc‚Âæ¹5.#©‰¦Öu…
            EXEC::page.melee.fakeAttack()
        ¼?o¥ê
            EXEC::page.melee.fakeAttack()
    
    karik
        itzil!!
    
    itzil
        ŒGÕò©–áë
    
    sourceless
        the noise does not stop until there is nothing left for them to hold
            EXEC::page.melee.fakeAttack()

    RESPONSES::akizet
        ...<+>END
            FAKEEND::(end combat)
            EXEC::cutscene(true);endCombat(env.rpg.enemyTeam);page.melee.stop();specialCam(false)

END::cutscene(false);startDialogue('bossclear')
`)

env.dialogues["bossclear"] = generateDialogueObject(`
start
____SHOWIF::'gameplay_off'
    sys
        ATTENTION::"thoughtform combat gameplay bypassed";'toggle within system menu if desired'
____END

    sourceless
        then... silence
            EXEC::toggleBgm(env.embassy.music_golems_cleared);env.embassy.music_unsafe_golems.rate(1);env.stages['g_boss'].hideBoss();
        indeed, this is victory, but...
            EXEC::change("PAGE!!golboss", true)
        shared between all of us, the connection feels little joy
        for the storm has not yet passed
    
    akizet
        ...all clear!
    
    sourceless
        soon we are all assembled in this final room
        tozik waves gakvu over near the far wall,
            EXEC::vnp({tozik: "show downleft", gakvu:"show downright"});
        both giving our conjoined friends some space
        i do not truly know itzil or their kivii, yet...
        i understand what must be going on in their mindcore
    
    tozik
        where is it?
    
    sourceless
        gakvu focuses, squinting at sludgy wall component covers
        then, she points with one of her receptors at one near the far end
    
    gakvu
        cut through here, and we will have our extra connectors!
            EXEC::specialCam('g_postboss')
    
    tozik
        on it
    
    sourceless
        he exposes his corruskivi, preparing to cut through the wall
        but then it occurs to him how large a task this truly is
        that is a big cover...
    
    tozik
        itzil, karik?
        can you remove this for me?
    
    sourceless
        our attention shifts to their shared golem
            EXEC::vnp({tozik: "hide", gakvu:"hide", ikgolem: "show far", bg: true})
        they are still doubled over near the corpse of the constructor...
        but then they rise, floating over to the panel
            EXEC::vnp({tozik: "hide", gakvu:"hide", ikgolem: "show", bg: true})
    
    karik
        i will take care of it!
        sorry, itzil is taking, um, a moment...
    
    sourceless quiet
        karik digs the golem's edged fingers into the sides of the wall,
            EXEC::vn.fadeChars(true);vnp({bg: false});play('crit', 0.75)
    
    sourceless
        tearing the panel away
            EXEC::vnp({tozik: "show downleft", gakvu:"show downright", ikgolem: "hide"});env.stages['g_boss'].removeHatch()
        of course, it is so damaged that once they pull it away, it simply melts in their claws...
            EXEC::vn.fadeChars(false);
    
    tozik
        thank you
        let me see...
    
    sourceless
        tozik pulls a wired connector from the wall, placing it upon his receptor
        he taps at the face of the little assistant display

    tozik
        yes, we can use this - still functional
        it was in a hibernative state, so... only a little incoherence
        just like geli...
        anyway, we can make enough connectors for everyone
        then--after that, we can descend further to the groundsmind
        just like we planned, right?
    
    sourceless
        he looks between us
        i still feel confident that we are making the right decision, but..
        this feels larger than the groundsmind...
        what if it does not actually stop this madness?
        still - i gesture my receptors affirmatively at him, dipping my head confidently

    tozik
        all right
        give me some time
        cavik, stand by - i will need your help
    
    cavik
        will do!!
    
    sys
        ATTENTION::'memory stream corrupt';'unable to access further events'
        NOTE::'sufficient intact data';'coherent render can continue'
        NOTE::'no further activity detected'
    
    moth
        oh, interesting...
        this one doesn't end in a hard crash
        but it isn't incoherent, like the interview was...
        so you can still look around some. nice
        i'll keep an eye on activity, but it looks like a good time for a break
        if i see any changes in these memories, i'll let you know
        you can probably save the iteration again, but...
        i don't think there's anything else to do yet

    RESPONSES::sys
        save and continue render<+>explore
            EXEC::vn.done()
            FAKEEND::(continue recollection)
        save and end render<+>save
            EXEC::vn.done()
            FAKEEND::(end recollection)
        end render without saving<+>END
            EXEC::vn.done();moveTo("/local/ocean/embassy")
            FAKEEND::(end recollection)

explore
    sys
        ATTENTION::'saving iteration...'
        ...
            EXEC::env.embassy.collapseSave({effects: true})
            WAIT::1000
        NOTE::'save process complete'
        NOTE::'return to entity tozik once stream repair is complete'

    RESPONSES::self
        ok<+>END
            EXEC::pauseSwapCam(false);specialCam(false)

save
    sys
        ATTENTION::'saving iteration...'
        ...
            EXEC::env.embassy.collapseSave({effects: true})
            WAIT::1000
        NOTE::'save process complete'
        ATTENTION::'terminating render'

    RESPONSES::self
        ok<+>END
            EXEC::moveTo("/local/ocean/embassy/")
`)
/* 1:1s */
env.dialogues["tozik_resp"] = generateDialogueObject(`
RESPOBJ::
    RESPONSES::akizet
        timestopper effectiveness?<+>timestopper
        points of interest?<+>segment
            SHOWIF::'PAGE!!geli'
        anyone you know?<+>anyone
        theories?<+>theory
        leave<+>END
            EXEC::vn.done()
`)
env.dialogues["tozik"] = generateDialogueObject(`
loop
    RESPOBJ::tozik_resp

start
    sourceless
        tozik eyes me expectantly as i approach him
            EXEC::vnp({hideStage: true, tozik:"show"})
        where he normally might wait for me to address him, he instead greets me
    
    tozik
        akizet
    
    RESPOBJ::tozik_resp

timestopper
    akizet
        tozik!
        how much longer will the timestopper serve us remotely?
        we are some distance away, yet...
        it seems to be working exactly the same
    
    tozik
        the timestopper's effectiveness is not exactly linear
        it uses a highly efficient, near-instantaneous form of dull transmission
        similar to the kind used to connect floating qou limbs to their bodies, but with more force
        so... it will work, until it simply does not
        before we descend again, to be safe...
        we will need to find a way to bring it closer to the groundsmindry floor
        
____SHOWIF::'PAGE!!mboss'
        i suspect gakvu may be able to help us, there

    akizet
        would it not be risky to reach that far from a groundsmindry override?
    
    tozik
        no less risky than proceeding without a timestopper
____END

    RESPONSES::akizet
        i see<+>loop
            FAKEEND::(back)

segment
    akizet
        tozik!
        is there anything we should watch for here?
        any equipment you saw in your recent visit?
    
    sourceless
        tozik's attention drifts away for a blink
    
    tozik
        all equipment of particular note is in that troublesome room...
        that impressor is all that comes to mind
        and, of course, the large construction golem they were putting together...
        it will not be a simple foe for us to face
        ah, still, this may not be a full engineering floor,
        but there are vats we can use for construction - lesser and greater
        if there is not much of note to find,
        then we will need to make our own equipment of note

    RESPONSES::akizet
        all right<+>loop
            FAKEEND::(back)

anyone
    akizet
        tozik!
        is there anyone we should watch for?
        any friends of yours, or--anything?
    
    sourceless
        i know his relationships are a sensitive subject
        they must be even more so, now...
        still, i must ask
    
    tozik
        no
    
    sourceless
        an answer without delay
        it would be foolish to pry further

    RESPONSES::akizet
        all right...<+>loop
            FAKEEND::(back)

theory
    akizet
        tozik!
        what do you think is happening?
____SHOWIF::'PAGE!!barfriend'
        do you still think it is too early to tell?
____END

    tozik
        well...
        we have seen that the signal--whatever it is--seizes things at random
        sometimes with groundsmindry, other times without...
        but it is only ever corru unoccupied by a mind, be it qou or strong echo
        <span definition="INHERITED CONTEXT::'idiom';'remember'">have in sight</span> as well--movefriend was fine when repaired, until the groundsmind took notice
        the barfriend did not attack us either
        so, all said, it is clear to me that the groundsmindry is compromised, but...
        certain constructs with weaker echoes, like the containers and lamps, are seized without groundsmindry
        what if the true cause is the signal itself?
        what if vekoa had exited the groundsmindry for one reason or another,
        then the signal came, 
        and used it to warp our golems to its purpose?
    
    akizet
        but how...
        groundsmindry requires too much mental focus for it to be something like that, right?
    
    sourceless
        tozik simply waves his receptors negatively
    
    tozik
        whatever is happening is reaching far beyond any limitation i was familiar with
        you felt the meaning behind the signal too, did you not? it was beyond full understanding
        and the way it invaded our minds directly, even rendering us into unwilling unconsciousness...
        to lesser echoes, like the simple ones within containers and lamps, 
        even the attendants and these golems we face now,
        it may have completely overridden their echoes with whatever purpose the signal truly meant to impart
        this theory is the best i have, for now...
        either way, i am certain that seizing the groundsmindry will at least partially end this madness

    RESPONSES::akizet
        it has to be<+>loop
            FAKEEND::(back)
`)

//SHOWIF::"gol__intro-end"
env.dialogues["gakvu_resp"] = generateDialogueObject(`
RESPOBJ::
    RESPONSES::akizet
        groundsmindry?<+>groundsmindry
        miltza?<+>miltza
        theories?<+>theory
        leave<+>END
            EXEC::vn.done()
`)
env.dialogues["gakvu"] = generateDialogueObject(`
loop
    RESPOBJ::gakvu_resp

start
    sourceless
        as i approach gakvu, she dips her head and receptors respectfully
            EXEC::vnp({hideStage: true, gakvu:"show"})
        though, their playful twist has been undone in light of what we have seen...
    
    gakvu
        what do you need, akizet?
    
    RESPOBJ::gakvu_resp

groundsmindry
    akizet
        gakvu!
        i have been wondering...
        you have had your groundsmindry this whole time, yes?
        have you ever used it before? 
        with us, or in the research tendril?
        i never even had the slightest suspicion...
    
    gakvu
        hehe
        well, akizet, the punishment far outweighed any benefit to using it
        even when i was alone... or lazy...
        it is a tool that has laid dormant for a long time
        to say nothing of vekoa's attentiveness
        besides, i must admit to you
        that is part of why i took this position
        i wanted to get away from everything... 
        everything i had involved myself in, back home
        you do not simply climb into a mindcore with groundsmindry by accident
        still, it is like i said
        even if i have brought us so far with it, it must remain a secret at all costs
    
    sourceless
        i sense a pointed edge in her words
        just when she nearly opened up even more...
    
    RESPONSES::akizet
        of course<+>loop
            FAKEEND::(back)

miltza
    akizet
        gakvu...
        about miltza, she, ah,
    
    sourceless
        i keep my voice down, but even still, she cuts me off
    
    gakvu
        do you want to feed this flame, akizet?
        the smoke would suffocate us
    
    sourceless
        there is not just cynicism in her words
        it is concern for me, too...
        what am i to make of this?
        how can i trust either of them at this point?
        but--she is right
        we must work harmoniously to survive
    
    RESPONSES::akizet
        of course...<+>loop
            FAKEEND::(back)

theory
    akizet
        gakvu!
        do you have any theories on what is happening?
    
    gakvu
        not really
        well, i guess i do have one...
        ah--no, it is stupid
        even if vekoa turned on us, how could she seize the containers and lamps?
        their ability to receive groundsmindry is so limited...
        there would have to be groundsmindry relays dotted throughout the spire
        last i felt, this one follows an archival pattern rather than a relay pattern
    
    sourceless
        as i listen, her explanation crawls to a stop, and she watches me strangely
        ah--i accidentally formed the slightest curl in my receptors
        too vague for her to tell why, but, she cuts herself off...
    
    gakvu
        ...to put it simply, i have no ideas
        we just have to stop it and get out
    
    RESPONSES::akizet
        agreed!<+>loop
            FAKEEND::(back)
`)


env.dialogues["miltza_resp"] = generateDialogueObject(`
RESPOBJ::
    RESPONSES::akizet
        remote operation?<+>remote
        suspicious of gakvu?<+>gakvu
        separative trauma?<+>itzil
            SHOWIF::"PAGE!!mboss"
        theories?<+>theory
        leave<+>END
            EXEC::vn.done()
`)
env.dialogues["miltza"] = generateDialogueObject(`
loop
    RESPOBJ::miltza_resp

start
    sourceless
        miltza fidgets with her claws, her receptors clasped with anxiety
            EXEC::vnp({hideStage: true, miltza:"show focus"})
        when she notices my approach, she ceases, standing at attention with her receptors opened
    
    miltza
        akizet! hello!
    
    RESPOBJ::miltza_resp

remote
    akizet
        miltza!
        what kind of remote work did you do?
        you were a coordinator, yes?
    
    miltza
        oh--yes!!
        i kept watch over the surface around akaniva, with the rest of my team...
        do you recall the early coordination pods?
        before groundsmindry had even been tried, haha!
        our minds were projected to airborne surface drones, where we guided runners, and...
        ...well, since i was the only tir, i typically handled all of the casualty trauma cases
        um, you know... when only part of a team was lost
    
    sourceless
        all too well
        surface trauma paralysis is far deadlier than any lone predator

____SHOWIF::'aug|drone'
    akizet
        how is that drone we created for you faring?
        it is lucky that the archives had something we could use...

    sourceless
        there is a sort of excitement in her receptors i have not seen before
        they give a single excited wave, a brief glimmer of whoever she was before this started
    
    miltza
        it is like i am home again!
        in... many ways
    
    sourceless
        her emboldened moment passes in a blink

    miltza
        it may not seem like much, but i feel so much more focused
        and it is funny! having it here... it is like an echo of my larval life
        velzie's fondness for repetition is truly nauseating

____SHOWIF::[['aug|drone', false], ['PAGE!!removedDrone', true]]
    akizet
        i feel i must apologize
        that drone we made for you, ah...
    
    miltza
        no no, it is fine!
        do not worry about it!
        you and your friends are better suited for fighting, anyway!
        
    sourceless
        there is a sort of meekness in her stance
        to give a weapon she loves, and then simply tear it away
        but, it seemed like the right move...
        we needed those materials to make other things
    
    miltza
        besides, the drone...
        i could see the husks of these poor qou in so much detail
        and you know--it is like the surface saying
        the less you think of death, the better chances you have of surviving!

____SHOWIF::[['aug|drone', false], ['PAGE!!removedDrone', false]]
    sourceless
        oh!

    akizet
        ah--does that mean you wielded one of the more heavily armed drones?
    
    miltza
        oh, yes!
    
    akizet
        i see...
        perhaps we could construct a drone for you, here
        yes--the timestopper could allow you to fight on two fronts!
    
    sourceless
        immediately, something in her stance changes
        that flightiness from before slightly fades... the notion emboldens her!!
    
    miltza
        you are right!!
        even a small one could change our odds...
        still, it is like an echo of my larval life
        velzie's fondness for repetition is truly nauseating
____END
    
    RESPONSES::akizet
        truly<+>loop
            FAKEEND::(back)

gakvu
    akizet
        miltza!
        about you and gakvu...
    
    sourceless
        there is a sort of frustrated curl that forms in the tendrils of her receptors
        
    miltza
        have we not resolved this?
        if she is your friend, and you trust her, i will too
        i cannot spend any time thinking about this,
        given what we must do
    
    sourceless
        ah...
        well said - there is little room to interrogate her further
        perhaps this was her intention...
        no, no--i am letting that stupid cyst get to me again
        if i pry further, it may place us as foes, whether she is within the conflict or not
        for now, things must be as simple as they seem
        yes, a simple cultural dispute...
    
    akizet
        of course
    
    RESPONSES::akizet
        ...<+>loop
            FAKEEND::(back)

itzil
    akizet
        miltza!
        about the separative trauma situation
        i have never seen it myself, so...
        what do you think is going to happen with itzil?
    
    miltza
        oh...
        <span definition="INHERITED CONTEXT::'idiom';'up to chance'">it is a dance upon veilk</span>, akizet!!
        rarely do these things ever follow the same path
        but karik said they were together since they were larval...
        umm, i will just say,
        if itzil wakes up before this is over, we must tread carefully
        itzil will never be the same, this i know
        they may take drastic actions - out of vengeance, or worse
        velzie's eye hangs over us in this time, closer than the veilk
    
    RESPONSES::akizet
        i see<+>loop
            FAKEEND::(back)

theory
    akizet
        miltza!
    
    sourceless
        i know what may test her allegiance
        if she is within the conflict, maybe she has a clue...

    akizet
        do you have any theories on what may be happening?
        the source of this madness--do you know what it is?
    
    sourceless
        ìƒì0¡$
        that just spilled out
        i did not mean to say it like that
        Eü#ë%'Eü
        velzie strike me now
        i am so stupid
    
    akizet
        sorry--i mean,
    
    sourceless
        she sees the recoiling twist in my receptors,
        signaling the slightest confusion in hers
        did that not even seem strange to her?
        i must suppress my panic
    
    miltza
        i have my suspicions...
        this is surely the work of saboteurs,
        whether it be one terrible mind, or a collective
        they are betrayers - throwing everything we have worked for away
        to what service, i cannot say, but...
        this is far too directed for it to be anything else

    RESPONSES::akizet
        i see<+>loop
            FAKEEND::(back)
`)

env.dialogues["mindcores_resp"] = generateDialogueObject(`
RESPOBJ::
    RESPONSES::itzil
        points of interest?<+>places
            SHOWIF::["PAGE!!mboss", false]
        kivii<+>kivii
            SHOWIF::["PAGE!!mboss", false]
        geli?<+>geli
            SHOWIF::["PAGE!!mboss", false]
        dog?<+>dog
            SHOWIF::[["PAGE!!dog", true], ["PAGE!!mboss", false]]
        golem weapon?<+>sorrycyst
            SHOWIF::[["item|sorry_cyst", true], ["PAGE!!mboss", false]]

    RESPONSES::karik
        construction?<+>construction
        golem body?<+>golem
            SHOWIF::"PAGE!!ikgolem"
        itzil?<+>itzil1
            SHOWIF::[["PAGE!!ikgolem", false], ["PAGE!!mboss", true]]
        itzil?<+>itzil2
            SHOWIF::[["PAGE!!ikgolem", true], ["PAGE!!mboss", true]]

    RESPONSES::akizet
        theories?<+>theory
            SHOWIF::["PAGE!!mboss", false]
        leave<+>END
            EXEC::vn.done()
`)
env.dialogues["mindcores"] = generateDialogueObject(`
loop
    RESPOBJ::mindcores_resp

start
____SHOWIF::[['PAGE!!mboss', true], ['PAGE!!ikgolem', true]]
    sourceless
        within this great golem is held both karik and itzil,
            EXEC::vnp({hideStage: true, ikgolem:"show"})
        though i suspect itzil is still dormant within...
        as i approach, they stare down at me,
        going so far as to lower the height they hover at
    
    karik
        ah, my savior!
        what do you need?
    
    sourceless
        itzil may still be withdrawn, yet karik shines vibrantly
        this new body has inspired great confidence... 
        for good reason, of course
    
    akizet
        karik, such a title will tempt velzie to turn the winds
        you can save that for when we have escaped

____SHOWIF::[['PAGE!!mboss', true], ['PAGE!!ikgolem', false]]
    sourceless
        karik sits quietly, itzil's dormant mindcore perched atop them, secured with two legs
            EXEC::vnp({hideStage: true, karik:"show"})
        together, the two look like some sort of strange fungal growth
        when i approach, karik's defocused eyes light up
    
    karik
        akizet! hello!

____SHOWIF::['PAGE!!mboss', false]
    sourceless
        itzil and karik chitter to one another quietly
            EXEC::vnp({hideStage: true, karik:"show", itzil: "show"})
        my approach brings that to a slow halt, and they turn to face me
    
    karik
        akizet!
        how beholds you!
    
    itzil
        hi akizet
____END

    RESPOBJ::mindcores_resp

places
    akizet
        itzil!
        this place is practically your home...
        is there anything we should watch for?
        perhaps any locations to find armaments, or schematics?
    
    itzil
        oh, yes!!
            EXEC::vnp({itzil: "focus"})
        beyond the override, which, umm, supercedes all else...
        manufacturing has a few vats we can use to create things...
        the minor operations tendril has some archival connections that may lend us schematics,
        oh, and the sfer tendril will grant us a pool of resources to create with!
        it is not as much as if we were on, say, the materials segment
        but since we worked on so many golems down here, we have our own mini-supply
        we even have our own pre-processors!
    
    sourceless
        some pride is carried with itzil's words, enough for me to pay it mind
        but as i do, itzil suddenly withdraws, their eye drifting around
    
    itzil
        well... had...
    
    sourceless
        their receptors settle into a sorrowful clasp
    
    akizet
        thank you, itzil
        we will get through this
    
    sourceless
        yes, they have seen us cut down the animated remains of their team...
            EXEC::vnp({itzil: "defocus"})
        what are they supposed to feel? what do i say?
        any support i offer will be washed away by the blood of any further husks we must fight
        i briefly shift my gaze to karik, and gesture a receptor covertly
        they understand, i think - to help brace itzil
        this is not easy for any of us, but itzil knew each of these people...

    RESPONSES::akizet
        ...<+>loop
            FAKEEND::(back)

kivii
    akizet
        itzil!
        could you remind me again what your kivii looks like?
    
    sourceless
        i nearly said 'looked'...
        the odds of her still being alive are not great
        especially with these new monstrosities
        
    itzil
        oh, yes, of course!
            EXEC::vnp({itzil: "focus"})
        dozkallvi! she is a kiv, with a broken receptor
        it is a memento of a heroic deed she achieved on the surface, you see
    
    sourceless
        a distinct and eccentric mark, enough to identify her in its own right
        that is probably enough to watch out for
    
    itzil
        she is an expert with remote lifting tools, so...
        if she is still on this segment, she is probably in manufacturing somewhere!
        velzie instills a vision - she has been smashing these creatures with ease, no doubt!
        once we find her, our odds will grow so much greater!

    RESPONSES::akizet
        they certainly will<+>loop
            FAKEEND::(back)
            EXEC::vnp({itzil: "defocus"})

geli
    akizet
        itzil!
        what do you know about geli?
        is it usually so... ah, what is the word
        ignorant? naive?
        there is something strange about its echo
        i do not even really know what, but...
        it is like it looked through me, for a moment

    itzil
        oh, umm...
            EXEC::vnp({itzil: "focus"})
        geli is extremely smart! usually!
        maybe it is just some damage from the signal?
        but--i know what you mean
        when i connected to geli for that instant,
        there was this strange and terrible vision...
        a dream, like it said,
        it was so brief, but so strong:
        a pale sphere of light glowing brightly in the thickest fog
        or was it fog? i could not tell for certain, but it obscured nearly all vision beyond a few steps
        but yes--a dark, cold place
        and from the light slowly came a strange flickering tendril, which touched my head...
        then the vision ended, and geli awoke
    
    sourceless
        ...

    akizet
        is that...
    
    itzil
        it is not normal
        echoes do not have dreams or visions, akizet
        i trust geli, but we should watch it carefully

    RESPONSES::akizet
        understood<+>loop
            FAKEEND::(back)
            EXEC::vnp({itzil: "defocus"})

dog
    akizet
        itzil!
        what is the construct we saw in the sfer supply?
        the one that looks like a <span definition="NOTE::'partial translation';'implied closest cultural equivalent'">dog</span>?
        it had no hostility, yet had no greater intelligence than the golems...
    
    itzil
        oh, yes!!
            EXEC::vnp({itzil:"focus"})
        that is our little mascot, kuulla!
        kuulla is usually in a hibernative state, like geli was, so...
        it is likely that the signal simply passed over it and could not take hold
        you see, it only awakens when a vat is ready to be harvested
        and it scurries to find someone to attend to it...
        how strange that the golems did not turn upon it!!

    RESPONSES::akizet
        agreed<+>loop
            FAKEEND::(back)
            EXEC::vnp({itzil: "defocus"})

construction
    akizet
        karik!
        you seem to know much about corrucystic construction
        especially with this spire...
        what is it that you did, before all this?
        you lived in the research segment with us, right?
    
    karik
        i did, i did, my friend!
            EXEC::vnp({karik:"focus"})
        in these recent eyes i have focused upon designing schematics for polygonation towers
        that is probably why we have never met
        i spent most of my time prospecting for locations, and then preparing polygonation designs
        you see, the terrain on this planet is so varied, no one design will do
        oh, and before that, i did help with the growth of the embassy!
        not since the eyes when velzie beheld the bare spireseed, though...
    
    akizet
        oh!
        you have been here since the beginning?
    
    karik
        haha! hardly, hardly!
        i was here in only the most technical sense...
        much of that time was spent waiting, or hibernating
        spire construction is not very exciting

    RESPONSES::akizet
        i see<+>loop
            FAKEEND::(back)
            EXEC::vnp({itzil: "defocus"})

golem
    akizet
        karik!
        what do you think of this body?
        do you feel it will serve our purposes?
        the golem in the advanced operations room sounds quite dangerous...
    
    karik
        oh, akizet, do not fear!
        tozik took great care in choosing the deadliest tools we have
        what luck that such archaic designs still exist in the archives, right?
        a veilksplitter on another planet... hahaha!!!
        the golem will give us no trouble, let me assure you
    
    sourceless
        so much confidence out of nowhere...
        karik is a kiv, this is true, but so much weight is carried on their strength
        i must temper this confidence, lest they endanger both themselves and itzil
        not to mention our best tool against whatever may await us
    
    akizet
        the weaponry we have afforded is truly a kind turn of velzie's gaze
        but... you must be careful, still
        we are counting on you
    
    karik
        of course, akizet
        i will not let you down

    RESPONSES::akizet
        thank you<+>loop
            FAKEEND::(back)

itzil1
    akizet
        karik...
        how is itzil?
    
    sourceless
        karik shifts itzil's dormant core forwards to eye it again
    
    karik
        unresponsive, still...
        do not worry, i am watching them carefully
        i will feel the slightest stir!

    RESPONSES::akizet
        carry them well<+>loop
            FAKEEND::(back)

itzil2
    akizet
        karik,
        how is itzil doing?
        any change?
    
    sourceless
        karik waves their receptors negatively
    
    karik
        nothing major
        i think they may have awoken for the briefest blink...
        if only to determine what they were held within
        then they receded again
        still, this is a good sign - itzil is not lost
        i will keep watch!
        
    RESPONSES::akizet
        thank you<+>loop
            FAKEEND::(back)

theory
    akizet
        karik, itzil!
        do you have any ideas on what might be happening?
    
    sourceless
        they exchange brief gazes,
        and i can tell by karik's slight backwards receptor movement they have truly no idea
        but itzil speaks up
    
    itzil
        umm... it is a little 'out there'...
        but i was thinking,
        what if this is some sort of rogue echo that has spread across the collective?
        it would explain the connection to equipment groundsmindry does not usually reach,
        and also the hijacking of the core!
        still, there is no precedent for any sort of echo malfunction of this scale, so...
    
    karik
        yes, that makes sense!
        if an attack on all of us were to be conducted, it would definitely be through the collective!
        everything routes through it - it is the single greatest point of failure!
    
    itzil
        haha, well...
        there are greater ones! but it is a big one
        it is like i said, though - it would only partially explain what is happening
        for example, why did the second iteration of the signal affect you more strongly than us?
        more corru for it to contact?
        anyway--that is the best i have for now!
        i am sure the groundsmindry will give us some real answers
        
    RESPONSES::akizet
        agreed<+>loop
            FAKEEND::(back)

sorrycyst
    akizet
        itzil!
        where is it that we can use this weapon schematic?
        
    sourceless
        i offer the strangely marked cyst to itzil,
        though the gesture is unneeded, waved away by their receptors
    
    itzil
        easy! that would be the lesser vats in manufacturing
            EXEC::vnp({itzil:"focus"})
        if you want to make anything small, fast, that is where you do it!
        we will be able to make some real weapons there

    RESPONSES::akizet
        got it<+>loop
            FAKEEND::(back)
            EXEC::vnp({itzil: "defocus"})
`)

env.dialogues["cavik_resp"] = generateDialogueObject(`
RESPOBJ::
    RESPONSES::akizet
        about my message...<+>message
        defenses?<+>defense
        theories?<+>theory
        leave<+>END
            EXEC::vn.done()
`)
env.dialogues["cavik"] = generateDialogueObject(`
loop
    RESPOBJ::cavik_resp

start
    sourceless
        cavik anxiously observes the ceiling and walls, perhaps trying to detect possible alternate paths
            EXEC::vnp({hideStage: true, cavik: "show focus"})
        he made his way here by detonating new paths, after all...
        still, his attention quickly shifts to me, and he stands straight
    
    cavik
        akizet?
    
    RESPOBJ::cavik_resp

defense
    akizet
        cavik!

    sourceless
        i look cavik over, scanning his <span definition="INHERITED CONTEXT::'vaznian traditional garment';'robe-like'">jekzi</span> for anything new
        aside from some wounds and a handful of small repair devices, he carries little...

    akizet
        how have you been defending yourself and bozko for so long?
        these creatures are deadly to us, even with the timestopper
    
    cavik
        ahh! you see, i have been forming explosives!
        a simple collection of golem parts fished out from their remains, re-instructed in just the right way...
        and they become little shrapnel bombs!
    
    sourceless
        he pats a bulbous pouch in his jekzi near his other devices
    
    akizet
        where did you learn that...?
    
    cavik
        oh, it just made sense...
        <span definition="INHERITED CONTEXT::'metaconnective corrucyst';'attaches to another node via dull bone paradigm'">dull nodes</span> in cheap golems are notoriously unstable if prodded in the right way!
        and the archival golems each have, um, six, i think...
        so i have a lot of them!
    
    sourceless
        i chuckle a little...
        perhaps for the first time since this all began
        'it just made sense'
    
    akizet
        very creative, cavik

    RESPONSES::akizet
        keep them handy<+>loop
            FAKEEND::(back)

message
    akizet
        cavik!
        when you dropped down, and, ah...
        bozko protected you from that golem,
    
    sourceless
        plain in his stance and slightly twisted receptors is my answer already
        it is stupid that i even ask
        but i must be certain

    akizet
        did you receive a...
    
    cavik
        yes...
        akizet, i heard you
    
    sourceless
        ...
        to discuss our winding paths in plain view of anyone else is foolish
        even he understands this, choosing his words carefully

    cavik
        i just barely started to understand it when bozko dropped behind me
        um... did you mean it?
    
    akizet
        i did
    
    sourceless
        cavik is silent for an instant, his gaze drifting away
        it is like before - no tears to be shed in our deaths
        still, perhaps he had grown too used to my distance
        i am truly unbefitting of these vel receptors
    
    cavik
        ...thank you, akizet
        this is not your fault
        we will get out of here!!

    RESPONSES::akizet
        ...<+>loop
            FAKEEND::(back)
    
theory
    sourceless
        this will surely brighten his mood

    akizet
        cavik!
        do you have any ideas on what might be happening?
        we have discussed it ourselves, but still, nothing solid...
    
    cavik
        oh, i have not really thought that much about it, actually...
        it had been so difficult just to stay present in our descent
        and with everyone we lost...
        i just want to tear my consciousness away from this whole mess, akizet
        i do not even want to think about it
        
    akizet
        oh...
    
    cavik
        but--!
        the root cause is the groundsmindry, it has to be
        so, if we keep going, we can put a stop to it, then...
        well, um...
        i do not know what will happen, or what this will mean for our work
        or our bright cousins, or us
        it is all so overwhelming
    
    akizet
        we will handle it

    RESPONSES::akizet
        just stay together<+>loop
            FAKEEND::(back)
`)

env.dialogues["bozko_resp"] = generateDialogueObject(`
RESPOBJ::
    RESPONSES::akizet
        survival?<+>survival
        you are not alone<+>notalone
            SHOWIF::'PAGE!!boztalk'
        theories?<+>theory
        leave<+>END
            EXEC::vn.done()
`)
env.dialogues["bozko"] = generateDialogueObject(`
loop
    RESPOBJ::bozko_resp

start
    sourceless
        bozko hovers with all the flat expression of a golem
            EXEC::vnp({hideStage: true, bozko: "show focus"})
        something is so wrong... he is not himself
            SHOWIF::['PAGE!!boztalk', false]
        i have never seen self-alteration myself before, but this feels like it
            SHOWIF::['PAGE!!boztalk', false]
        i wish there was more i could do for him...
            SHOWIF::'PAGE!!boztalk'
        he notices my staring, and stares back
    
    RESPOBJ::bozko_resp

survival
    akizet
        bozko!
            EXEC::change("PAGE!!boztalk", true)
        how have you been able to make it down here?
        even with the timestopper, we have struggled against these foes...
    
    sourceless
        i see some sparse expression in his receptors
        a backwards pull, maybe some twist - he does not want to talk about it
        but i have to talk to him about something
        he is not well
        and it is like the tir say--reality withdrawal is the only sure path to final death
        well, it was...
        oh! he lifts his floating arms
        the twist in his receptors grows more severe as he eyes a gauntlet
    
    bozko
        a jut friend from materials modified the <span definition="INHERITED CONTEXT::'metaconnective corrucyst';'attaches to another node via dull bone paradigm'">dull nodes</span> to have greater range
        ...to help me collect ocean specimen on our trips more effectively
        but now, i use the modification to fight from afar
    
    sourceless
        is it that simple? no...
        there is something else
        he fights like an automaton, with such practice
        i saw it when he saved cavik - the speed with which he helped...
        it was beyond natural
    
    akizet
        but--
    
    bozko
        and i have seen this all before
        when i was larval, my home suffered a secri infestation
        i was one of the defenders, and...
        so many of my friends, my family, were lost
        killed, then brought to <span definition="INHERITED CONTEXT:'parasite';'reanimation'">terrible life</span> again
        only for <em>me</em> and the few defenders who remained, to...
    
    sourceless
        he clutches his face, growing silent
    
    akizet
        bozko, you--you do not have to--
    
    bozko
        i died there, and i suppressed the memory
        i always knew it was there...
        and now i have to use it again
        i had never fought like it before, and never did again
        but it is now all that has kept cavik and i intact
        akizet... it is like it has been overlapping
        these caves, these people... it feels like i am larval,
        fighting for my life again against everyone i once knew
        i keep trying to rewrite it, or suppress it just enough...
    
    sourceless
        the twist in his receptors becomes undone, 
        and in his voice is the sole strong expression i have heard from him this gaze
        it is anger--spite, maybe disgust
    
    bozko
        velzie's fondness for repetition is truly nauseating

    RESPONSES::akizet
        ...<+>loop
            FAKEEND::(back)

notalone
    akizet
        bozko...
        you are not alone in this
        do not try to rewrite yourself just for our sakes
        we have made it this far--and together, we will finish this
        
    bozko
        yes...
        i understand the strength of the timestopper
        but akizet, i cannot let anyone else meet their final deaths
        not even a chance can remain
        i will do whatever it takes to get us all out
        the aftermath, whatever happens to me... does not matter
    
    akizet
        yes it does!!
        
    sourceless
        ah--i must be careful of my tone...
        he hovers now over a razor's edge
        a spiral of self modification, or a spiral of memory re-integration
        it is only the balance he has managed so far that has saved him
        bozko...
    
    akizet
        just let us share the burden
        if you want to help us escape, we must truly work together
        and that means you must be well
        please, just be careful
    
    bozko
        i will, akizet

    RESPONSES::akizet
        ...<+>loop
            FAKEEND::(back)

theory
    sourceless
        with the state he is in
        is it inappropriate to ask him his thoughts?
        the more i can speak with him, the more i can reach him, so...
        i will try it!
    
    akizet
        bozko!
        what do you think is happening? the cause of all this...
        we have discussed it a little, but
    
    sourceless
        i find myself trailing off as he prepares to respond
        in his stance, his gaze, his receptors
        all at once comes a crushing darkness
        
    bozko
        i cannot begin to speculate how
        but it is an infestation, spreading outwards...
        since even golems cut off from the network were hostile
        so the source must be destroyed--the groundsmindry
        and i will ensure that whoever has orchestrated this does not escape

    RESPONSES::akizet
        we will, bozko<+>loop
            FAKEEND::(back)
`)
