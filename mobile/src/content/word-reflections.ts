/**
 * Original short reflections and prayers for each daily verse in DAILY_VERSES.
 * Scripture itself is the World English Bible (public domain); the prose below
 * is original writing for ONE PRAYER.
 */
export type WordReflection = { reflection: string; prayer: string };

/** Keyed by the exact `ref` string from DAILY_VERSES. */
export const WORD_REFLECTIONS: Record<string, WordReflection> = {
  "Psalm 46:1": {
    reflection:
      "This psalm was sung by people who had seen the earth shake and the waters roar, yet they called God a refuge and a very present help. Present, not distant. You do not have to tidy up your trouble before you bring it. Whatever is shaking in your life today, you can step inside that shelter just as you are, still trembling if need be.",
    prayer:
      "Lord, you are my refuge when things feel unsteady. I come to you with my trouble as it is, not as I wish it were. Be near to me today, and help me rest in your presence even while the ground still moves. Amen.",
  },
  "Isaiah 41:10": {
    reflection:
      "Isaiah spoke these words to exiles who felt forgotten and small. Notice how often God repeats himself here: I am with you, I am your God, I will strengthen, I will help, I will uphold. It is the language of someone steadying a person who keeps losing their footing. If fear has a grip on you today, it is okay to feel it. You are not holding yourself up alone.",
    prayer:
      "Father, I confess that I am afraid in ways I cannot always explain. Thank you that you do not scold my fear but speak into it. Hold me with your steady hand today, and grant me courage for the next small step. Amen.",
  },
  "Philippians 4:6-7": {
    reflection:
      "Paul wrote this from prison, which makes his words about anxiety feel less like a slogan and more like hard-won experience. He does not tell you to pretend. He invites you to name your requests, every one of them, and to mix in thanks where you can find it. The peace he describes is not an explanation; it is a guard stationed around your heart and mind.",
    prayer:
      "Lord, here are the things that weigh on me today. I name them honestly before you, and I thank you for the good I can still see. Guard my heart and my thoughts with your peace, even where I do not understand. Amen.",
  },
  "Philippians 4:13": {
    reflection:
      "Read in context, this verse follows Paul's words about learning contentment in both plenty and hunger. It is less about achieving anything you set your mind to and more about enduring whatever comes with Christ beside you. Whether today feels full or thin, you are invited to lean on a strength that is not your own and to face your real circumstances with quiet steadiness.",
    prayer:
      "Lord Jesus, teach me the secret Paul learned: to be steady in seasons of plenty and seasons of need. When my own strength runs low, let me lean on yours. Help me meet today faithfully, whatever it holds. Amen.",
  },
  "Matthew 11:28": {
    reflection:
      "Jesus does not address the strong or the put-together here. He calls out to those who labor and carry heavy loads. If that describes you, the invitation is simply to come. You do not need the right words or a clear head. Rest, in his hands, is not a reward for finishing everything; it is something he offers to the tired right in the middle of it.",
    prayer:
      "Jesus, I am tired, and some of what I carry is too heavy for me. I come to you now without polish or pretense. Grant my weary heart rest, and teach me to keep coming back to you. Amen.",
  },
  "Matthew 11:29": {
    reflection:
      "A yoke was a wooden frame that let two animals share a load. Jesus offers to walk under it with you, and he describes himself as gentle and humble in heart. That is worth sitting with. The one you are learning from is not harsh or impatient. He knows how to pace a journey, and the rest he mentions reaches deeper than the body, down into the soul.",
    prayer:
      "Gentle Lord, I want to learn from you. Where I have been driving myself hard, slow me down to your pace. Walk beside me under today's load, and let your humble heart shape mine. Amen.",
  },
  "John 14:27": {
    reflection:
      "Jesus spoke these words on the night before his death, knowing his friends were about to be shaken. The peace he left them was not the absence of hardship but his own settled presence. The world's peace often depends on circumstances lining up. His does not. If your heart feels troubled tonight, you can receive what he offered then: a peace that stays when things are uncertain.",
    prayer:
      "Lord Jesus, you know how quickly my heart gets unsettled. I receive the peace you left for your friends. Quiet the fearful places in me, and help me trust that your presence is steady when my circumstances are not. Amen.",
  },
  "John 14:1": {
    reflection:
      "The disciples had just heard that Jesus was leaving, and confusion filled the room. His response was simple: believe in God, believe also in me. He did not answer every question they had. He pointed them to himself. When your mind races ahead with worry, you can do the same. You may not have every answer yet, but you can rest in the one who knows the way.",
    prayer:
      "Lord, my heart gets troubled when I cannot see what comes next. Instead of chasing every answer, I turn my trust toward you. Steady my thoughts, and help me believe that you know the way even when I do not. Amen.",
  },
  "Romans 8:28": {
    reflection:
      "This verse is sometimes used to hurry people past their pain, but Paul wrote it right after describing creation groaning and the Spirit praying with sighs too deep for words. It does not say every event is good. It says God is at work within all things, weaving even sorrow into a larger purpose. You can hold this hope and still grieve what hurts.",
    prayer:
      "Father, I do not understand everything that has happened to me. I bring you the painful pieces as well as the good ones. Help me trust that you are at work, even where I cannot yet see how. Amen.",
  },
  "Psalm 23:1": {
    reflection:
      "David had been a shepherd himself, so he knew how much care a flock requires: leading to water, watching for danger, searching for strays. When he calls the LORD his shepherd, he is describing a watchful, personal care. To lack nothing here speaks of being provided for in what truly matters. Wherever you find yourself today, you are not an unattended sheep.",
    prayer:
      "Lord, you are my shepherd. Thank you for the quiet ways you watch over me. When I feel restless or wanting, lead me to what I truly need, and help me recognize your care along the way. Amen.",
  },
  "Psalm 23:4": {
    reflection:
      "Notice that the psalm does not skip the dark valley. It walks straight through it. The comfort is not that the shadows vanish but that you are not alone in them. If you are walking through loss, illness, or fear right now, it is okay to feel how dark it is. Let someone you trust walk alongside you too, as the Shepherd does.",
    prayer:
      "Lord, some days the valley feels long and dim. Thank you that you walk through it with me. Let your nearness comfort me, and bring people alongside me who can help me carry what I am facing. Amen.",
  },
  "Proverbs 3:5-6": {
    reflection:
      "These words were written as a parent's counsel to a child. Trusting with all your heart does not mean switching off your mind; it means not treating your own understanding as the final word. In all your ways, the small decisions as well as the large, you can turn your attention toward God. Straight paths are often discovered one honest step at a time.",
    prayer:
      "Lord, I often lean hard on my own reasoning. Today I want to acknowledge you in the ordinary choices as well as the big ones. Teach me to trust you with my whole heart, and guide my steps. Amen.",
  },
  "Joshua 1:9": {
    reflection:
      "Joshua was stepping into Moses' place, facing a new land and a daunting task. God's command to be strong and courageous came with a reason: the LORD your God is with you wherever you go. Courage here is not the absence of fear but moving forward with company. Whatever new responsibility you face, you do not walk into it by yourself.",
    prayer:
      "Lord, I feel unready for some of what is in front of me. Thank you that you go with me wherever I go. Grant me courage that rests on your presence rather than my own confidence. Amen.",
  },
  "Isaiah 40:31": {
    reflection:
      "The picture moves from soaring, to running, to simply walking without fainting. Sometimes faith feels like wings, and sometimes it is just putting one foot in front of the other. Both are gifts. Waiting on the LORD is not passive; it is a patient, hopeful leaning toward him. If today you can only walk, that ordinary step still counts.",
    prayer:
      "Lord, I want to wait on you well. On days I soar, let me thank you. On days I can barely walk, renew my strength enough for the next step. Teach me the patient hope that leans toward you. Amen.",
  },
  "Isaiah 40:29": {
    reflection:
      "This verse is addressed to people who have run out of strength. It does not ask you to find more power inside yourself first. It says God gives power to the weak and increases strength where there is none. If you feel emptied today, your weakness is not a disqualification. It is exactly the place where this promise was meant to be heard.",
    prayer:
      "Father, I feel weak and worn today, and I will not pretend otherwise. I bring you my emptiness. Be my strength where I have none, and help me receive your help without shame. Amen.",
  },
  "Psalm 34:18": {
    reflection:
      "David wrote this psalm after a frightening, humiliating season on the run. He knew what a crushed spirit felt like. The LORD's nearness to the brokenhearted means heartbreak is not a sign that God has left you. If your heart is aching right now, it is okay to let it ache. Please also reach out to someone you trust; you do not have to carry this alone.",
    prayer:
      "Lord, my heart feels broken, and I do not have neat words for it. Thank you for drawing near to the crushed in spirit. Stay close to me in this ache, and lead me to people who can share it with me. Amen.",
  },
  "Matthew 6:34": {
    reflection:
      "Jesus acknowledges plainly that each day has its own trouble. He is not naive about hardship. What he invites you to do is keep your worry the size of today. Tomorrow will bring its own concerns, and grace for them will come too. For now, you can set down what has not yet arrived and turn your attention to this one day.",
    prayer:
      "Lord, my mind keeps running ahead into tomorrow's worries. Help me to live in today, the only day I have been handed. Grant me what I need for this day, and let me leave tomorrow with you. Amen.",
  },
  "Matthew 6:33": {
    reflection:
      "This line closes Jesus' teaching about worry over food and clothing. He does not dismiss those needs; he reorders them. Seeking God's Kingdom first means letting his ways and his goodness shape your priorities. The things you anxiously chase can take their proper place when your heart is anchored in something larger than your own list of concerns.",
    prayer:
      "Father, my priorities get tangled with worry. Help me seek your Kingdom and your righteousness first today. Put my concerns in their proper place, and anchor my heart in your goodness. Amen.",
  },
  "Matthew 6:26": {
    reflection:
      "Jesus points to ordinary birds as a lesson in trust. They do not plant or store up, and yet they are fed. His question lands gently: aren't you of much more value than they? This is not a call to stop working. It is a reminder that your worth is not measured by how much you manage to control. You are known and valued by your heavenly Father.",
    prayer:
      "Heavenly Father, when I look at the birds, remind me that you care for your creation. Loosen my grip on the need to control everything. Help me rest in knowing that I am valued by you. Amen.",
  },
  "Lamentations 3:22-23": {
    reflection:
      "These hopeful lines sit in the middle of a book of grief, written over a ruined city. The writer does not deny the devastation around him. He simply remembers something truer underneath it: God's mercies have not failed. They are new every morning. If yesterday was heavy, this morning brings fresh mercy. You can grieve and still watch for it.",
    prayer:
      "Lord, some of my mornings begin heavy with what happened the day before. Thank you that your mercies are new each day. Help me notice your faithfulness, even in the middle of grief. Amen.",
  },
  "Psalm 121:1-2": {
    reflection:
      "Pilgrims sang this psalm on the road to Jerusalem, looking up at hills that could hide danger as easily as beauty. The question is honest: where does my help come from? The answer lifts your gaze higher than the hills to the maker of heaven and earth. When you feel exposed or uncertain today, you can ask the same question and reach the same answer.",
    prayer:
      "Lord, I lift my eyes to you. When I look around and feel exposed, remind me that my help comes from you, the maker of heaven and earth. Watch over my going out and my coming in today. Amen.",
  },
  "Deuteronomy 31:6": {
    reflection:
      "Moses spoke these words near the end of his life, preparing the people to go on without him. They would face opponents and uncertainty. The encouragement rests not on their own strength but on this: the LORD himself goes with you. He will not fail you nor forsake you. Whatever transition or goodbye you are facing, you are accompanied through it.",
    prayer:
      "Lord, change unsettles me, and some goodbyes are hard. Thank you that you go ahead of me and with me. Grant me courage for this season, and help me trust that you will not forsake me. Amen.",
  },
  "Isaiah 26:3": {
    reflection:
      "Isaiah links peace with a steadfast mind, one that keeps returning to trust. That returning is the practice. Your thoughts will wander toward worry many times a day, and that is human. Each time you notice it, you can gently turn back to God. Perfect peace here is less a feeling you manufacture and more a keeping that God does as you trust him.",
    prayer:
      "Lord, my mind wanders into worry again and again. Each time, help me turn back to you. Keep my heart in your peace, and grow in me a steady trust that rests in who you are. Amen.",
  },
  "John 16:33": {
    reflection:
      "Jesus never told his followers that life would be easy. He said plainly, in the world you have trouble. Then he added, cheer up, I have overcome the world. Both statements are true at once. You can be honest about what is hard right now and still take heart, because the final word does not belong to your trouble.",
    prayer:
      "Lord Jesus, thank you for being honest about trouble. I bring you what is hard in my life today. Help me take heart in you, trusting that you have overcome the world, even when I feel overwhelmed. Amen.",
  },
  "2 Corinthians 12:9": {
    reflection:
      "Paul had asked repeatedly for a painful burden to be removed. The answer he received was not the one he wanted, but it changed him: my grace is sufficient for you. It is okay to have asked for something and still be waiting. Paul found that weakness became a place where Christ's power could rest. Your limits are not beyond the reach of grace.",
    prayer:
      "Lord, there are weaknesses I wish you would simply remove. Whatever you choose, let your grace be enough for me today. Help me stop hiding my limits and let your power rest on me in them. Amen.",
  },
  "Romans 15:13": {
    reflection:
      "Paul closes a long letter with a blessing, and he calls God the God of hope. Joy and peace here come in believing, through the Holy Spirit's power, not through forcing yourself to feel cheerful. Hope is something God fills you with, like water poured into a vessel. If your hope feels low today, you can hold out your empty cup.",
    prayer:
      "God of hope, my hope feels low today. I hold out my heart to you like an empty cup. Fill me with your joy and peace as I trust you, by the power of your Holy Spirit. Amen.",
  },
  "Psalm 55:22": {
    reflection:
      "David wrote this psalm after being betrayed by a close friend. Out of that hurt he says, cast your burden on the LORD. To cast means to throw, not to set down gently while keeping one hand on it. God will sustain you, meaning he will hold you up as you carry life. You are welcome to hand him the heaviest part of today.",
    prayer:
      "Lord, I have been holding this burden too tightly. I place it in your hands now, as fully as I can. Sustain me as I walk through it, and help me not to pick it back up again. Amen.",
  },
  "Psalm 27:1": {
    reflection:
      "David asks two questions: whom shall I fear, and of whom shall I be afraid? They are not denials that frightening things exist. They are declarations about who is bigger. The LORD as light means you are not stumbling blind; as salvation, you are not left to rescue yourself; as strength, you are not holding up your own life. Let those truths settle today.",
    prayer:
      "Lord, you are my light when things seem dark, and my strength when I feel weak. When fear rises in me, remind me who you are. Help me walk in your light today. Amen.",
  },
  "Psalm 27:14": {
    reflection:
      "The psalm ends by repeating itself: wait for the LORD. Waiting is often the hardest part, and David seems to know it. He pairs waiting with courage, because it takes courage to keep hoping when nothing has changed yet. If you are in a waiting season, you are not failing. Let your heart take courage, one day at a time.",
    prayer:
      "Lord, waiting is hard for me. Some days I grow impatient, and some days discouraged. Strengthen my heart as I wait for you, and grant me courage to keep hoping today. Amen.",
  },
  "Psalm 56:3": {
    reflection:
      "This psalm comes from a time when David was seized by enemies in a foreign city. Notice he does not say if I am afraid, but when. Fear is expected, not shameful. The response is a choice to place trust in God in the very moment fear arrives. It is okay to feel afraid today. You can let that fear become a doorway to trust.",
    prayer:
      "Lord, I am afraid, and I will not pretend I am not. In this moment, I choose to put my trust in you. Hold me steady while my feelings catch up with my faith. Amen.",
  },
  "Nahum 1:7": {
    reflection:
      "Nahum is a short, stormy book, and this gentle verse shines in the middle of it. The LORD is good, a stronghold in the day of trouble, and he knows those who take refuge in him. To be known is a deep comfort. You are not a stranger seeking shelter. When trouble comes, you run toward someone who already knows your name.",
    prayer:
      "Lord, you are good. Thank you that you know me, even the parts I rarely show anyone. Be my stronghold in this day of trouble, and let me rest in being known by you. Amen.",
  },
  "Psalm 91:1-2": {
    reflection:
      "Dwelling suggests staying, not just visiting. The secret place of the Most High is a picture of settled nearness to God, like living in the shade of someone much greater than you. The psalmist then speaks it aloud: he is my refuge and my fortress. Sometimes saying what you believe, even quietly, helps your heart find its place of rest.",
    prayer:
      "Most High God, I want to dwell with you and not just visit. Let me rest in your shadow today. I say it with my own lips: you are my refuge and my fortress, my God in whom I trust. Amen.",
  },
  "2 Timothy 1:7": {
    reflection:
      "Paul wrote this to Timothy, a young leader who seems to have struggled with timidity. Rather than shaming him, Paul reminds him what God has placed within him: power, love, and self-control. Fear may still show up in you, but it is not the spirit God has given. You can ask for the courage, love, and sound mind that are already his gifts.",
    prayer:
      "Father, fear often tries to take the lead in me. Thank you that it is not the spirit you have given. Stir up in me your power, your love, and a sound, self-controlled mind today. Amen.",
  },
  "Romans 8:38-39": {
    reflection:
      "Paul's list is sweeping on purpose. Death, life, angels, powers, the present, the future, heights, depths, anything else in all creation. He could not think of a single thing that could separate you from God's love in Christ. Whatever you fear might pull you away, whether failure, distance, or doubt, it has already been named and answered. You are held.",
    prayer:
      "Lord, thank you that nothing in all creation can separate me from your love. When I feel far away or unworthy, remind me that I am held in Christ Jesus. Let that love steady me today. Amen.",
  },
  "Isaiah 43:2": {
    reflection:
      "Notice the word when, not if. Isaiah expects that you will pass through waters and walk through fire. The comfort is God's presence in the passing through: I will be with you. This is not a promise of an easy road, but of company on a hard one. If you are in deep water right now, it is okay to feel overwhelmed. You are not alone in it.",
    prayer:
      "Lord, the waters feel deep and the heat feels close. Thank you for being with me in it. Keep me from being swept away by fear, and help me feel your presence as I pass through. Amen.",
  },
  "Isaiah 43:19": {
    reflection:
      "God spoke this to people stuck in exile, who kept looking back to the old days. Behold, I will do a new thing. The image of a way in the wilderness and rivers in the desert suggests newness in the most barren places. You may not see it clearly yet. Don't you know it? The invitation is to look for small signs of life where you least expect them.",
    prayer:
      "Lord, I often look back and wish for what used to be. Open my eyes to the new things you are doing. Where life feels like wilderness, help me notice the first signs of fresh water. Amen.",
  },
  "Psalm 30:5": {
    reflection:
      "David wrote this psalm after a season of distress, looking back with gratitude. He does not rush past the night. Weeping may stay for the night, he says, and that is honest. Tears are allowed to linger. But he also remembers that morning came. If you are still in the night, it is okay to cry, and it is okay to hope for morning.",
    prayer:
      "Lord, some nights feel long, and my tears are real. Thank you that you do not hurry me through sorrow. Stay with me in the dark hours, and let me hold on to hope for the morning. Amen.",
  },
  "Psalm 118:24": {
    reflection:
      "This psalm was sung in celebration after deliverance, and it names today as a day the LORD has made. That includes ordinary days, dull days, and hard days. Rejoicing here is less about feeling giddy and more about recognizing that this day is not an accident. You can look for one thing in it worth being glad about.",
    prayer:
      "Lord, this day is yours. Whether it feels bright or plain, help me receive it as a gift. Open my eyes to at least one reason for gladness, and let my heart respond with thanks. Amen.",
  },
  "Psalm 16:8": {
    reflection:
      "Setting the LORD always before you is a deliberate act of attention. It is choosing, again and again, to keep God in view. David found that with God at his right hand, the place of a close companion and defender, he would not be shaken. Stability here comes not from calm circumstances but from where you fix your gaze throughout the day.",
    prayer:
      "Lord, I want to set you before me today. When distractions pull my gaze away, draw it back to you. Be at my right hand, and keep my heart from being shaken. Amen.",
  },
  "Philippians 4:19": {
    reflection:
      "Paul wrote this to a church that had cared for him generously in his need. He had already said he learned contentment in every circumstance. Here he speaks of God meeting every need, which reaches far beyond material things to include comfort, courage, wisdom, and companionship. You can bring your real needs to God and trust his care for you in Christ Jesus.",
    prayer:
      "Father, you know my needs better than I do. I bring them to you honestly, the practical ones and the hidden ones. Help me trust your care and learn contentment in whatever season I am in. Amen.",
  },
  "2 Corinthians 4:16": {
    reflection:
      "Paul does not pretend that bodies stay young or that hardship leaves no mark. Our outward person is decaying, he admits. Yet something inward is being renewed day by day. If you are feeling worn down by age, illness, or long strain, that is real. Alongside it, quietly and daily, God is at work in a part of you that the years do not diminish.",
    prayer:
      "Lord, I feel the wear of life in my body and my mind. Thank you that you are renewing me inwardly, day by day. Grant me courage not to lose heart, and let your quiet work in me continue. Amen.",
  },
  "Galatians 6:9": {
    reflection:
      "Doing good can be tiring, especially when no one seems to notice and results are slow. Paul knows this, which is why he speaks to weariness directly. The picture is of a harvest that comes in its own season, not on your schedule. If you are close to quitting a good thing, take a breath. Faithful, quiet kindness is never wasted in God's hands.",
    prayer:
      "Lord, I am weary in doing good, and I confess I want to see results. Renew my heart for the work in front of me. Help me stay faithful in small acts of kindness and leave the harvest to you. Amen.",
  },
  "James 1:5": {
    reflection:
      "James wrote to believers facing trials and confusing choices. His encouragement is simple: if you lack wisdom, ask. God responds without reproach, meaning he does not scold you for not knowing. There is no shame in being unsure. Whatever decision is in front of you today, you can bring your uncertainty honestly and ask for the wisdom to walk well.",
    prayer:
      "Father, I do not know what to do in some areas of my life. I ask you for wisdom, and I thank you that you do not scold me for asking. Grant me clarity and a humble heart as I decide. Amen.",
  },
  "Psalm 32:8": {
    reflection:
      "This promise follows David's confession of sin and the relief of being forgiven. The God who forgives also teaches. I will counsel you with my eye on you suggests attentive, personal guidance, like a mentor who watches closely. The next verse warns against being like a stubborn mule. You are invited to be teachable, willing to be led rather than dragged.",
    prayer:
      "Lord, thank you for your forgiveness and your guidance. Make me teachable today. Show me the way I should go, and keep my heart soft enough to follow your counsel. Amen.",
  },
  "Psalm 119:105": {
    reflection:
      "A lamp in the ancient world lit only a few steps ahead, not the whole road. That is often how God's word guides: enough light for the next step, not a map of the entire journey. You may long to see farther than you can. For today, it may be enough to take the step that is lit and trust the light to move with you.",
    prayer:
      "Lord, I often want to see the whole path at once. Thank you for your word, which lights my next step. Help me walk faithfully in the light I have, and trust you with what lies further on. Amen.",
  },
  "1 John 4:18": {
    reflection:
      "John writes that fear has to do with punishment, the anxious sense that you might be rejected. God's love meets that fear head on. Perfect love, his love, is not waiting to punish you but to welcome you. Fear may not vanish all at once. But as you learn how deeply you are loved, it slowly loosens its hold. Growth in love takes time.",
    prayer:
      "Father, some of my fear comes from wondering whether I am truly accepted. Let your perfect love reach those places in me. Loosen fear's hold little by little, and teach me to rest in being loved. Amen.",
  },
  "Psalm 139:9-10": {
    reflection:
      "The psalmist imagines going as far as possible, riding the dawn to the farthest sea. Even there, God's hand would lead and hold him. This is not a threat of being watched but a comfort of being accompanied. Wherever you find yourself today, far from home, far from where you hoped to be, you have not wandered beyond the reach of that hand.",
    prayer:
      "Lord, there is nowhere I can go that is beyond your reach. When I feel far away or lost, let me sense your hand leading and holding me. Thank you for following me into every place. Amen.",
  },
  "Psalm 147:3": {
    reflection:
      "This psalm praises God who numbers the stars and also binds up wounds. The same God who governs the cosmos bends low to tend a broken heart. Binding a wound is careful, patient work, and it takes time. If your heart is hurting, you do not need to rush your recovery. It is okay to feel the wound, and to let trusted people help care for it too.",
    prayer:
      "Lord, you care for the brokenhearted with such tenderness. I bring you the wounds I carry. Tend them with your patient care, and surround me with people who can help me along the way. Amen.",
  },
  "Matthew 5:4": {
    reflection:
      "Jesus begins his great sermon by naming people the world overlooks, including those who mourn. Grief is not treated as a lack of faith; it is met with a promise of comfort. If you are mourning someone or something today, your sorrow is seen. There is no timetable for grief. Let yourself feel it, and let others who love you share the weight.",
    prayer:
      "Lord, I am grieving, and some days it feels endless. Thank you that you see those who mourn. Comfort me in ways I can receive, and bring gentle people near who can sit with me in sorrow. Amen.",
  },
  "2 Corinthians 1:3-4": {
    reflection:
      "Paul calls God the Father of mercies and the God of all comfort, and then shows where that comfort flows next: outward, to others. The hard things you have walked through are not wasted. The comfort you receive in your own affliction can become something you share with someone else who is hurting. Your story, gently told, may be exactly the kindness another person needs.",
    prayer:
      "Father of mercies, thank you for comforting me in my troubles. Let the comfort I receive overflow to others who are hurting. Grant me a gentle heart and open eyes for someone who needs care today. Amen.",
  },
  "Psalm 4:8": {
    reflection:
      "David wrote this as an evening prayer, after a day of distress and people speaking against him. Lying down to sleep is an act of trust, letting go of control for a few hours. If rest is hard for you tonight, you can hand the day back to God. Whatever was left undone or unresolved can wait until morning, in his keeping.",
    prayer:
      "Lord, as this day ends, I hand it back to you. Quiet my racing thoughts, and help me lie down in peace. Watch over me and those I love through the night. Amen.",
  },
  "Colossians 3:15": {
    reflection:
      "The word Paul uses for rule suggests an umpire, the one who settles disputes. Letting God's peace rule means letting it make the call when your heart is divided or your relationships are tense. He also says you were called in one body, a reminder that this peace is shared, not solitary. And he ends simply: be thankful.",
    prayer:
      "Lord, let your peace settle the disputes in my heart and in my relationships. Help me live in harmony with others, and grow in me a thankful spirit that notices your goodness today. Amen.",
  },
  "1 Thessalonians 5:16-18": {
    reflection:
      "Paul packs three short instructions together: rejoice, pray, be thankful. Notice he says in everything, not for everything. You are not asked to be grateful for pain itself, but to look for God's presence within every circumstance. Praying without ceasing can be as simple as keeping an open, ongoing conversation with God as you move through your ordinary day.",
    prayer:
      "Lord, teach me to keep talking with you throughout the day. In every circumstance, help me find something to thank you for, and let quiet joy rise in me even in hard moments. Amen.",
  },
  "Psalm 107:1": {
    reflection:
      "This psalm goes on to tell stories of wanderers, prisoners, the sick, and sailors in storms, each one rescued and each one invited to thank him. His loving kindness endures forever, through every kind of trouble. You might take a moment today to remember one time you were helped, and let that memory turn into a simple word of thanks.",
    prayer:
      "Lord, you are good, and your loving kindness endures forever. I remember times you have helped me, and I thank you. Let gratitude shape how I see today and how I treat the people around me. Amen.",
  },
  "Hebrews 11:1": {
    reflection:
      "Hebrews goes on to list people who trusted God without seeing the full result in their lifetime. Faith, then, is not certainty about every outcome. It is assurance in the character of God, a quiet confidence that what he has spoken is real, even when your eyes cannot see it yet. If your faith feels small, it can still hold on.",
    prayer:
      "Lord, my faith sometimes feels thin. Strengthen my trust in who you are, even when I cannot see what lies ahead. Help me hold on to hope in you, one day at a time. Amen.",
  },
  "Psalm 46:10": {
    reflection:
      "Be still is sometimes heard as a gentle invitation to rest, and it is that. But in the psalm it also sounds like a command to stop striving, spoken over a world at war. God reminds his people who he is. You can find a quiet moment today to stop, breathe, and remember that you are not the one holding the world together.",
    prayer:
      "Lord, I am tired of striving and trying to hold everything together. Help me be still before you now. Remind me that you are God, and let my heart rest in that truth. Amen.",
  },
  "Psalm 73:26": {
    reflection:
      "The writer of this psalm had wrestled with envy and bitterness before finding his way back to God. His conclusion is honest: my flesh and my heart fail. He does not pretend to be strong. But God is the strength of his heart, and his portion, the share that cannot be taken away. When your own strength fails, that portion remains.",
    prayer:
      "Lord, my heart and my strength fail more often than I like to admit. Be the strength of my heart. Let me find my true portion in you, a portion no loss can take away. Amen.",
  },
  "Hebrews 4:16": {
    reflection:
      "The verses just before this describe Jesus as one who understands our weakness, having been tested in every way. That is why you can come with boldness, not bravado, but confidence that you will be met with mercy. You do not have to earn your way into God's presence. In your time of need, the door is open, and mercy waits.",
    prayer:
      "Lord Jesus, thank you for understanding my weakness. I come to you with boldness, trusting in your mercy rather than my own worthiness. Meet me with grace in this time of need. Amen.",
  },
  "Psalm 28:7": {
    reflection:
      "This psalm begins with a desperate cry and ends with a song. Somewhere between, David remembered that the LORD is his strength and his shield. Trust led to help, and help led to joy. If you are still at the beginning of the psalm, crying out, that is okay. You can hold on to the hope that a song may come again.",
    prayer:
      "Lord, you are my strength and my shield. I trust you, even in the middle of my crying out. Carry me toward the day when my heart can sing again. Amen.",
  },
  "James 1:17": {
    reflection:
      "James reminds you that every good thing in life comes from the Father of lights, who does not change like shifting shadows. The sunrise, a kind word, a shared meal, a moment of rest: each is a small sign of his steady goodness. You might pause today to notice one good thing and trace it back to the one who never varies.",
    prayer:
      "Father of lights, thank you for every good thing in my life, large and small. Open my eyes to notice your goodness today, and help me trust your unchanging character. Amen.",
  },
  "Psalm 103:12": {
    reflection:
      "East and west never meet. You can travel east forever and never arrive at west. That is the picture David uses for how far God removes our wrongs. If you are carrying guilt for something already confessed, this verse invites you to set it down. God is not keeping it close at hand to bring up again. You are free to walk forward.",
    prayer:
      "Lord, thank you for removing my wrongs so far from me. When old guilt returns, remind me of your forgiveness. Help me receive it fully and walk forward in freedom. Amen.",
  },
  "Psalm 145:18": {
    reflection:
      "This psalm celebrates God's greatness, and then it brings that greatness close: the LORD is near to all who call on him. The only condition given is calling in truth, meaning honestly, without pretending. You do not need eloquent words or a perfect life. You can speak to God plainly today, just as you are, and know that he is near.",
    prayer:
      "Lord, I call on you now, honestly and plainly. Thank you for being near to all who call on you. Hear the truth of my heart, and let me sense your nearness today. Amen.",
  },
};
