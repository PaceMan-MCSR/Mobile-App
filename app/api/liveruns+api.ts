export async function GET(request: Request) {
  // const response = await fetch("https://paceman.gg/api/ars/liveruns");
  // const res = await response.json();
  return Response.json(res.filter((run) => !run.isHidden && !run.isCheated));
}

const res = [
  {
    worldId: "9b5c58357d742a3cdd23a3334cf5c504b52cf30326ce4d469c894402e07c4b12",
    gameVersion: "1.16.1",
    eventList: [
      { eventId: "rsg.enter_nether", rta: 208984, igt: 208200 },
      { eventId: "rsg.enter_bastion", rta: 335195, igt: 323501 },
      { eventId: "rsg.enter_fortress", rta: 574645, igt: 561167 },
      { eventId: "rsg.first_portal", rta: 747268, igt: 733567 },
    ],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 55695, igt: 55150 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 176897, igt: 176350 },
      { eventId: "rsg.obtain_lava_bucket", rta: 198195, igt: 197650 },
      { eventId: "rsg.loot_bastion", rta: 341996, igt: 330301 },
      { eventId: "rsg.obtain_crying_obsidian", rta: 343950, igt: 332251 },
      { eventId: "rsg.obtain_obsidian", rta: 445493, igt: 433801 },
      { eventId: "rsg.obtain_blaze_rod", rta: 589594, igt: 576117 },
    ],
    user: { uuid: "4129d8d1-aafb-4e73-b97b-9999db248060", liveAccount: null },
    isCheated: false,
    isHidden: false,
    lastUpdated: 1724947725702,
    nickname: "CroProYT",
  },
  {
    worldId: "364ce11213f837cc74ca2094bc0072a4e6cf484bc9e83ea2fef80dbd29e465de",
    gameVersion: "1.16.1",
    eventList: [
      { eventId: "rsg.enter_nether", rta: 86678, igt: 84400 },
      { eventId: "rsg.enter_bastion", rta: 168607, igt: 161630 },
      { eventId: "rsg.enter_fortress", rta: 368354, igt: 358580 },
      { eventId: "rsg.first_portal", rta: 394615, igt: 384630 },
    ],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 17963, igt: 18000 },
      { eventId: "rsg.obtain_lava_bucket", rta: 72656, igt: 70600 },
      { eventId: "rsg.loot_bastion", rta: 170709, igt: 163730 },
      { eventId: "rsg.obtain_crying_obsidian", rta: 179854, igt: 172880 },
      { eventId: "rsg.obtain_obsidian", rta: 276610, igt: 269630 },
      { eventId: "rsg.obtain_blaze_rod", rta: 382808, igt: 373030 },
    ],
    user: { uuid: "878a61e3-2b2b-4a30-bfab-364820bf079c", liveAccount: "japonk86" },
    isCheated: false,
    isHidden: false,
    lastUpdated: 1724947739305,
    itemData: {
      estimatedCounts: { "minecraft:ender_pearl": 29, "minecraft:blaze_rod": 1 },
      usages: { "minecraft:ender_pearl": 4, "minecraft:obsidian": 11 },
    },
    nickname: "Japonk86",
  },
  {
    worldId: "fa4f30f941965d6e2cf55e3cf121cad129e82ecb8f914f0ecee5b045f2e75a4e",
    gameVersion: "1.16.1",
    eventList: [
      { eventId: "rsg.enter_nether", rta: 137949, igt: 133300 },
      { eventId: "rsg.enter_bastion", rta: 224759, igt: 189007 },
      { eventId: "rsg.enter_fortress", rta: 501956, igt: 462907 },
    ],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 26877, igt: 26800 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 66359, igt: 66350 },
      { eventId: "rsg.obtain_lava_bucket", rta: 118510, igt: 116850 },
      { eventId: "rsg.loot_bastion", rta: 251997, igt: 216257 },
      { eventId: "rsg.obtain_obsidian", rta: 253551, igt: 217807 },
      { eventId: "rsg.distract_piglin", rta: 272916, igt: 236007 },
      { eventId: "rsg.obtain_crying_obsidian", rta: 314419, igt: 277257 },
      { eventId: "rsg.obtain_blaze_rod", rta: 528332, igt: 487607 },
    ],
    user: { uuid: "79e22b3c-bffc-43b2-b7f5-8a2c26a0c494", liveAccount: null },
    isCheated: false,
    isHidden: false,
    lastUpdated: 1724947809390,
    itemData: {
      estimatedCounts: { "minecraft:ender_pearl": 9, "minecraft:obsidian": 13 },
      usages: { "minecraft:ender_pearl": 6 },
    },
    nickname: "Leakyss",
  },
  {
    worldId: "389e2e293c909778254035d8d2703556820f67b82752cdcea6b8136ba524e5c7",
    gameVersion: "1.16.1",
    eventList: [{ eventId: "rsg.enter_nether", rta: 101262, igt: 99517 }],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 17577, igt: 17567 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 42319, igt: 40867 },
      { eventId: "rsg.obtain_lava_bucket", rta: 87569, igt: 86117 },
    ],
    user: { uuid: "8826e1e6-d21b-46ec-bc5d-5246b836f36a", liveAccount: null },
    isCheated: false,
    isHidden: true,
    lastUpdated: 1724947554689,
    nickname: "NottAntoo",
  },
  {
    worldId: "0a2327b4c8ce1caedb4889e2e608a02c448fba4e77828d5ae499becf37793b09",
    gameVersion: "1.16.1",
    eventList: [{ eventId: "rsg.enter_nether", rta: 328690, igt: 327392 }],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 16648, igt: 15642 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 140140, igt: 139092 },
      { eventId: "rsg.obtain_lava_bucket", rta: 316335, igt: 315292 },
    ],
    user: { uuid: "6395c700-441b-4b18-a875-e1e8cf603f80", liveAccount: null },
    isCheated: true,
    isHidden: false,
    lastUpdated: 1724947561784,
    nickname: "Banxnaz",
  },
  {
    worldId: "a9d2ea5359055ad5602ffb0ce7b2253a4cb640333705d80f2595a5b7672bd9a6",
    gameVersion: "1.16.1",
    eventList: [
      { eventId: "rsg.enter_nether", rta: 108081, igt: 99647 },
      { eventId: "rsg.enter_bastion", rta: 165910, igt: 156947 },
    ],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 14110, igt: 14096 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 32152, igt: 30046 },
      { eventId: "rsg.obtain_lava_bucket", rta: 88305, igt: 85246 },
      { eventId: "rsg.distract_piglin", rta: 186452, igt: 177497 },
      { eventId: "rsg.obtain_crying_obsidian", rta: 241809, igt: 232847 },
      { eventId: "rsg.loot_bastion", rta: 243118, igt: 234147 },
      { eventId: "rsg.obtain_obsidian", rta: 249757, igt: 240797 },
    ],
    user: { uuid: "7da8a7da-ee7b-45bf-844e-3fd11e9fd854", liveAccount: "lathil1" },
    isCheated: true,
    isHidden: false,
    lastUpdated: 1724947654890,
    itemData: {
      estimatedCounts: { "minecraft:ender_pearl": 24, "minecraft:obsidian": 5 },
      usages: { "minecraft:ender_pearl": 5 },
    },
    nickname: "Lathilla",
  },
  {
    worldId: "11983ab00cf8d79b5d480cfd160da4c50e2f23cf5bc710ab6b653cc2e657c6fe",
    gameVersion: "1.16.1",
    eventList: [
      { eventId: "rsg.enter_nether", rta: 140760, igt: 139019 },
      { eventId: "rsg.enter_bastion", rta: 169113, igt: 159065 },
    ],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 27770, igt: 26369 },
      { eventId: "rsg.obtain_lava_bucket", rta: 129213, igt: 127819 },
      { eventId: "rsg.obtain_obsidian", rta: 175766, igt: 165715 },
      { eventId: "rsg.distract_piglin", rta: 184959, igt: 174915 },
      { eventId: "rsg.loot_bastion", rta: 186215, igt: 176165 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 192211, igt: 182165 },
      { eventId: "rsg.obtain_crying_obsidian", rta: 260165, igt: 246165 },
    ],
    user: { uuid: "fa48d763-ba4c-452f-b85d-fca945b39c61", liveAccount: "lala_style" },
    isCheated: false,
    isHidden: false,
    lastUpdated: 1724947636291,
    itemData: { estimatedCounts: { "minecraft:obsidian": 8 }, usages: {} },
    nickname: "Misiaczku",
  },
  {
    worldId: "5c69773d472d3bcc5b3ace868a49c7dfdb11073170df0f31b61aac83d273c3df",
    gameVersion: "1.16.1",
    eventList: [{ eventId: "rsg.enter_nether", rta: 109292, igt: 105000 }],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 21307, igt: 21450 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 40354, igt: 38800 },
      { eventId: "rsg.obtain_lava_bucket", rta: 99000, igt: 95800 },
    ],
    user: { uuid: "745a8199-7397-4fe1-bb16-08e57fd439b6", liveAccount: null },
    isCheated: true,
    isHidden: false,
    lastUpdated: 1724947631899,
    nickname: "centuriee",
  },
  {
    worldId: "9d76edf3610d9b957f209b1e49efc78671b6a12ac1deba6d04c6129fce2c6e78",
    gameVersion: "1.16.1",
    eventList: [
      { eventId: "rsg.enter_nether", rta: 221003, igt: 216595 },
      { eventId: "rsg.enter_bastion", rta: 329109, igt: 319475 },
    ],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 72271, igt: 70145 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 94112, igt: 91995 },
      { eventId: "rsg.obtain_lava_bucket", rta: 200957, igt: 197145 },
      { eventId: "rsg.loot_bastion", rta: 344306, igt: 334675 },
      { eventId: "rsg.obtain_obsidian", rta: 356659, igt: 347025 },
    ],
    user: { uuid: "afecd7c6-43b5-4d8a-8a32-b42a0db53418", liveAccount: "poydingu" },
    isCheated: false,
    isHidden: false,
    lastUpdated: 1724947755763,
    nickname: "DoyPingu",
  },
  {
    worldId: "9adff9ae61ea14a4806f92cb630732c7579ed9c3eb7650b018a3c8856de2e08a",
    gameVersion: "1.16.1",
    eventList: [
      { eventId: "rsg.enter_nether", rta: 87880, igt: 86301 },
      { eventId: "rsg.enter_bastion", rta: 199082, igt: 186723 },
    ],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 11138, igt: 11251 },
      { eventId: "rsg.obtain_lava_bucket", rta: 77480, igt: 76251 },
      { eventId: "rsg.distract_piglin", rta: 233178, igt: 220073 },
      { eventId: "rsg.obtain_crying_obsidian", rta: 246979, igt: 233873 },
      { eventId: "rsg.obtain_obsidian", rta: 255279, igt: 241373 },
      { eventId: "rsg.loot_bastion", rta: 265027, igt: 251123 },
    ],
    user: { uuid: "4f9c8cc8-3ea2-4032-bec4-53f452dd1487", liveAccount: null },
    isCheated: false,
    isHidden: false,
    lastUpdated: 1724947761589,
    nickname: "JokerTenidy",
  },
  {
    worldId: "33b9382332bf149227b79b7954ac822f2d20e43a33df4bdf12c9e8e7255a5138",
    gameVersion: "1.16.1",
    eventList: [{ eventId: "rsg.enter_nether", rta: 129866, igt: 129051 }],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 24826, igt: 24951 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 57311, igt: 56851 },
      { eventId: "rsg.obtain_lava_bucket", rta: 120111, igt: 119651 },
    ],
    user: { uuid: "182a4a03-fae5-4aa7-aed4-de1cf1f93d2b", liveAccount: null },
    isCheated: false,
    isHidden: true,
    lastUpdated: 1724947697922,
    nickname: "_BiBinka_",
  },
  {
    worldId: "d337c0c06e1cd49713cbeb44bd68c4efb695f4b2f07421645b6ceee24da13fb3",
    gameVersion: "1.16.1",
    eventList: [{ eventId: "rsg.enter_nether", rta: 128103, igt: 128096 }],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 31256, igt: 31550 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 61643, igt: 61950 },
      { eventId: "rsg.obtain_lava_bucket", rta: 96984, igt: 97296 },
    ],
    user: { uuid: "5cd115f0-ec12-4065-9db1-52406c0984a3", liveAccount: "yojakoo" },
    isCheated: false,
    isHidden: true,
    lastUpdated: 1724947699500,
    nickname: "yjako",
  },
  {
    worldId: "d4f294198f0ff39e3738a6537fac923eddb16de399b97d08503e9ffae941d592",
    gameVersion: "1.16.1",
    eventList: [{ eventId: "rsg.enter_nether", rta: 154340, igt: 151502 }],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 28530, igt: 28602 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 70181, igt: 68052 },
      { eventId: "rsg.obtain_lava_bucket", rta: 123129, igt: 121002 },
    ],
    user: { uuid: "80ffb8d4-fa53-470d-804f-af953ef8b723", liveAccount: null },
    isCheated: false,
    isHidden: true,
    lastUpdated: 1724947769661,
    nickname: "ToraneRuri",
  },
  {
    worldId: "6dfba6baa1b76d61590bf8ca56fa036d9caf40195c4179a9e659bf5a926e42c1",
    gameVersion: "1.16.1",
    eventList: [{ eventId: "rsg.enter_nether", rta: 137587, igt: 132641 }],
    contextEventList: [{ eventId: "rsg.obtain_obsidian", rta: 5576, igt: 5540 }],
    user: { uuid: "2e4fbe60-5685-49f7-a666-6e1ced1ae385", liveAccount: "r3nr_" },
    isCheated: false,
    isHidden: true,
    lastUpdated: 1724947833578,
    itemData: { estimatedCounts: {}, usages: { "minecraft:obsidian": 5 } },
    nickname: "R3nR",
  },
];
