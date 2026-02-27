import type { DecorationDefinition } from '@/shared/types';

// ─── Area Definitions ───
export const AREAS = [
    { id: 'bar', name: '吧台区', unlockLevel: 1, slots: 6 },
    { id: 'dining', name: '室内用餐区', unlockLevel: 3, slots: 6 },
    { id: 'kitchen', name: '厨房', unlockLevel: 6, slots: 5 },
    { id: 'terrace', name: '户外露台', unlockLevel: 10, slots: 6 },
    { id: 'garden', name: '花园', unlockLevel: 15, slots: 6 },
] as const;

export const AREA_MAP: Record<string, (typeof AREAS)[number]> = {};
for (const a of AREAS) {
    (AREA_MAP as Record<string, (typeof AREAS)[number]>)[a.id] = a;
}

// ─── Decoration Catalog ───
export const DECORATIONS: DecorationDefinition[] = [
    // Bar area
    {
        id: 'bar_counter', name: '吧台', area: 'bar', slot: 'counter', cost: { currency: 'coins', amount: 50 }, xpReward: 15, variants: [
            { id: 'bar_counter_wood', name: '木质吧台', svgKey: 'bar_counter_wood' },
            { id: 'bar_counter_marble', name: '大理石吧台', svgKey: 'bar_counter_marble' },
            { id: 'bar_counter_modern', name: '现代吧台', svgKey: 'bar_counter_modern' },
        ]
    },
    {
        id: 'bar_stool', name: '吧台椅', area: 'bar', slot: 'stool', cost: { currency: 'coins', amount: 30 }, xpReward: 10, variants: [
            { id: 'bar_stool_classic', name: '经典木椅', svgKey: 'stool_classic' },
            { id: 'bar_stool_cushion', name: '软垫椅', svgKey: 'stool_cushion' },
            { id: 'bar_stool_tall', name: '高脚铁椅', svgKey: 'stool_tall' },
        ]
    },
    {
        id: 'bar_shelf', name: '酒架', area: 'bar', slot: 'shelf', cost: { currency: 'coins', amount: 40 }, xpReward: 12, variants: [
            { id: 'bar_shelf_rustic', name: '复古酒架', svgKey: 'shelf_rustic' },
            { id: 'bar_shelf_glass', name: '玻璃展示架', svgKey: 'shelf_glass' },
            { id: 'bar_shelf_modern', name: '简约酒架', svgKey: 'shelf_modern' },
        ]
    },
    {
        id: 'bar_light', name: '灯饰', area: 'bar', slot: 'light', cost: { currency: 'coins', amount: 35 }, xpReward: 10, variants: [
            { id: 'bar_light_pendant', name: '吊灯', svgKey: 'light_pendant' },
            { id: 'bar_light_neon', name: '霓虹灯', svgKey: 'light_neon' },
            { id: 'bar_light_candle', name: '烛台灯', svgKey: 'light_candle' },
        ]
    },
    {
        id: 'bar_plant', name: '绿植', area: 'bar', slot: 'plant', cost: { currency: 'coins', amount: 20 }, xpReward: 8, variants: [
            { id: 'bar_plant_fern', name: '蕨类植物', svgKey: 'plant_fern' },
            { id: 'bar_plant_succulent', name: '多肉盆栽', svgKey: 'plant_succulent' },
            { id: 'bar_plant_ivy', name: '爬山虎', svgKey: 'plant_ivy' },
        ]
    },
    {
        id: 'bar_sign', name: '招牌', area: 'bar', slot: 'sign', cost: { currency: 'coins', amount: 60 }, xpReward: 18, variants: [
            { id: 'bar_sign_neon', name: '霓虹招牌', svgKey: 'sign_neon' },
            { id: 'bar_sign_wood', name: '木质招牌', svgKey: 'sign_wood' },
            { id: 'bar_sign_chalkboard', name: '黑板招牌', svgKey: 'sign_chalkboard' },
        ]
    },

    // Dining area
    {
        id: 'dining_table', name: '餐桌', area: 'dining', slot: 'table', cost: { currency: 'coins', amount: 60 }, xpReward: 18, variants: [
            { id: 'dining_table_round', name: '圆桌', svgKey: 'table_round' },
            { id: 'dining_table_long', name: '长桌', svgKey: 'table_long' },
            { id: 'dining_table_booth', name: '卡座', svgKey: 'table_booth' },
        ]
    },
    {
        id: 'dining_chair', name: '餐椅', area: 'dining', slot: 'chair', cost: { currency: 'coins', amount: 35 }, xpReward: 10, variants: [
            { id: 'dining_chair_wood', name: '木质餐椅', svgKey: 'chair_wood' },
            { id: 'dining_chair_padded', name: '软包椅', svgKey: 'chair_padded' },
            { id: 'dining_chair_metal', name: '金属椅', svgKey: 'chair_metal' },
        ]
    },
    {
        id: 'dining_wallart', name: '墙饰', area: 'dining', slot: 'wallart', cost: { currency: 'coins', amount: 45 }, xpReward: 14, variants: [
            { id: 'dining_wallart_painting', name: '油画', svgKey: 'wallart_painting' },
            { id: 'dining_wallart_photo', name: '照片墙', svgKey: 'wallart_photo' },
            { id: 'dining_wallart_mirror', name: '装饰镜', svgKey: 'wallart_mirror' },
        ]
    },
    {
        id: 'dining_curtain', name: '窗帘', area: 'dining', slot: 'curtain', cost: { currency: 'coins', amount: 40 }, xpReward: 12, variants: [
            { id: 'dining_curtain_silk', name: '丝绸窗帘', svgKey: 'curtain_silk' },
            { id: 'dining_curtain_linen', name: '亚麻窗帘', svgKey: 'curtain_linen' },
            { id: 'dining_curtain_beaded', name: '珠帘', svgKey: 'curtain_beaded' },
        ]
    },
    {
        id: 'dining_floor', name: '地板', area: 'dining', slot: 'floor', cost: { currency: 'coins', amount: 80 }, xpReward: 20, variants: [
            { id: 'dining_floor_tile', name: '瓷砖地板', svgKey: 'floor_tile' },
            { id: 'dining_floor_wood', name: '木质地板', svgKey: 'floor_wood' },
            { id: 'dining_floor_carpet', name: '地毯', svgKey: 'floor_carpet' },
        ]
    },
    {
        id: 'dining_centerpiece', name: '桌花', area: 'dining', slot: 'centerpiece', cost: { currency: 'coins', amount: 25 }, xpReward: 8, variants: [
            { id: 'dining_centerpiece_roses', name: '玫瑰花束', svgKey: 'centerpiece_roses' },
            { id: 'dining_centerpiece_candle', name: '蜡烛台', svgKey: 'centerpiece_candle' },
            { id: 'dining_centerpiece_orchid', name: '兰花', svgKey: 'centerpiece_orchid' },
        ]
    },

    // Kitchen
    {
        id: 'kitchen_stove', name: '炉灶', area: 'kitchen', slot: 'stove', cost: { currency: 'coins', amount: 100 }, xpReward: 25, variants: [
            { id: 'kitchen_stove_gas', name: '燃气灶', svgKey: 'stove_gas' },
            { id: 'kitchen_stove_induction', name: '电磁炉', svgKey: 'stove_induction' },
            { id: 'kitchen_stove_wood', name: '柴火灶', svgKey: 'stove_wood' },
        ]
    },
    {
        id: 'kitchen_fridge', name: '冰箱', area: 'kitchen', slot: 'fridge', cost: { currency: 'coins', amount: 90 }, xpReward: 22, variants: [
            { id: 'kitchen_fridge_classic', name: '经典冰箱', svgKey: 'fridge_classic' },
            { id: 'kitchen_fridge_retro', name: '复古冰箱', svgKey: 'fridge_retro' },
            { id: 'kitchen_fridge_smart', name: '智能冰箱', svgKey: 'fridge_smart' },
        ]
    },
    {
        id: 'kitchen_sink', name: '水槽', area: 'kitchen', slot: 'sink', cost: { currency: 'coins', amount: 50 }, xpReward: 15, variants: [
            { id: 'kitchen_sink_steel', name: '不锈钢水槽', svgKey: 'sink_steel' },
            { id: 'kitchen_sink_ceramic', name: '陶瓷水槽', svgKey: 'sink_ceramic' },
            { id: 'kitchen_sink_copper', name: '铜质水槽', svgKey: 'sink_copper' },
        ]
    },
    {
        id: 'kitchen_rack', name: '置物架', area: 'kitchen', slot: 'rack', cost: { currency: 'coins', amount: 40 }, xpReward: 12, variants: [
            { id: 'kitchen_rack_wall', name: '墙面架', svgKey: 'rack_wall' },
            { id: 'kitchen_rack_island', name: '中岛台', svgKey: 'rack_island' },
            { id: 'kitchen_rack_hanging', name: '吊挂架', svgKey: 'rack_hanging' },
        ]
    },
    {
        id: 'kitchen_vent', name: '抽油烟机', area: 'kitchen', slot: 'vent', cost: { currency: 'coins', amount: 70 }, xpReward: 18, variants: [
            { id: 'kitchen_vent_modern', name: '现代油烟机', svgKey: 'vent_modern' },
            { id: 'kitchen_vent_classic', name: '经典油烟机', svgKey: 'vent_classic' },
            { id: 'kitchen_vent_hidden', name: '隐藏式油烟机', svgKey: 'vent_hidden' },
        ]
    },

    // Terrace
    {
        id: 'terrace_umbrella', name: '遮阳伞', area: 'terrace', slot: 'umbrella', cost: { currency: 'coins', amount: 55 }, xpReward: 16, variants: [
            { id: 'terrace_umbrella_striped', name: '条纹伞', svgKey: 'umbrella_striped' },
            { id: 'terrace_umbrella_plain', name: '纯色伞', svgKey: 'umbrella_plain' },
            { id: 'terrace_umbrella_bamboo', name: '竹伞', svgKey: 'umbrella_bamboo' },
        ]
    },
    {
        id: 'terrace_table', name: '户外桌', area: 'terrace', slot: 'table', cost: { currency: 'coins', amount: 50 }, xpReward: 15, variants: [
            { id: 'terrace_table_iron', name: '铁艺桌', svgKey: 'terrace_table_iron' },
            { id: 'terrace_table_wood', name: '木桌', svgKey: 'terrace_table_wood' },
            { id: 'terrace_table_wicker', name: '藤编桌', svgKey: 'terrace_table_wicker' },
        ]
    },
    {
        id: 'terrace_railing', name: '栏杆', area: 'terrace', slot: 'railing', cost: { currency: 'coins', amount: 65 }, xpReward: 18, variants: [
            { id: 'terrace_railing_iron', name: '铁艺栏杆', svgKey: 'railing_iron' },
            { id: 'terrace_railing_glass', name: '玻璃栏杆', svgKey: 'railing_glass' },
            { id: 'terrace_railing_wood', name: '木栏杆', svgKey: 'railing_wood' },
        ]
    },
    {
        id: 'terrace_lights', name: '串灯', area: 'terrace', slot: 'lights', cost: { currency: 'coins', amount: 30 }, xpReward: 10, variants: [
            { id: 'terrace_lights_fairy', name: '仙女灯', svgKey: 'lights_fairy' },
            { id: 'terrace_lights_lantern', name: '灯笼串', svgKey: 'lights_lantern' },
            { id: 'terrace_lights_bulb', name: '复古灯泡', svgKey: 'lights_bulb' },
        ]
    },
    {
        id: 'terrace_planter', name: '花盆', area: 'terrace', slot: 'planter', cost: { currency: 'coins', amount: 25 }, xpReward: 8, variants: [
            { id: 'terrace_planter_ceramic', name: '陶瓷花盆', svgKey: 'planter_ceramic' },
            { id: 'terrace_planter_hanging', name: '吊挂花盆', svgKey: 'planter_hanging' },
            { id: 'terrace_planter_tiered', name: '阶梯花盆', svgKey: 'planter_tiered' },
        ]
    },
    {
        id: 'terrace_awning', name: '遮阳棚', area: 'terrace', slot: 'awning', cost: { currency: 'coins', amount: 80 }, xpReward: 20, variants: [
            { id: 'terrace_awning_retract', name: '可收缩棚', svgKey: 'awning_retract' },
            { id: 'terrace_awning_fixed', name: '固定棚', svgKey: 'awning_fixed' },
            { id: 'terrace_awning_vine', name: '藤蔓棚', svgKey: 'awning_vine' },
        ]
    },

    // Garden
    {
        id: 'garden_fountain', name: '喷泉', area: 'garden', slot: 'fountain', cost: { currency: 'coins', amount: 120 }, xpReward: 30, variants: [
            { id: 'garden_fountain_classic', name: '经典喷泉', svgKey: 'fountain_classic' },
            { id: 'garden_fountain_modern', name: '现代喷泉', svgKey: 'fountain_modern' },
            { id: 'garden_fountain_zen', name: '禅意喷泉', svgKey: 'fountain_zen' },
        ]
    },
    {
        id: 'garden_bench', name: '长椅', area: 'garden', slot: 'bench', cost: { currency: 'coins', amount: 45 }, xpReward: 14, variants: [
            { id: 'garden_bench_wood', name: '木质长椅', svgKey: 'bench_wood' },
            { id: 'garden_bench_stone', name: '石椅', svgKey: 'bench_stone' },
            { id: 'garden_bench_swing', name: '秋千椅', svgKey: 'bench_swing' },
        ]
    },
    {
        id: 'garden_path', name: '园路', area: 'garden', slot: 'path', cost: { currency: 'coins', amount: 60 }, xpReward: 18, variants: [
            { id: 'garden_path_stone', name: '石板路', svgKey: 'path_stone' },
            { id: 'garden_path_gravel', name: '碎石路', svgKey: 'path_gravel' },
            { id: 'garden_path_brick', name: '砖路', svgKey: 'path_brick' },
        ]
    },
    {
        id: 'garden_flower', name: '花圃', area: 'garden', slot: 'flower', cost: { currency: 'coins', amount: 35 }, xpReward: 10, variants: [
            { id: 'garden_flower_roses', name: '玫瑰园', svgKey: 'flower_roses' },
            { id: 'garden_flower_tulips', name: '郁金香', svgKey: 'flower_tulips' },
            { id: 'garden_flower_lavender', name: '薰衣草', svgKey: 'flower_lavender' },
        ]
    },
    {
        id: 'garden_statue', name: '雕塑', area: 'garden', slot: 'statue', cost: { currency: 'coins', amount: 100 }, xpReward: 25, variants: [
            { id: 'garden_statue_angel', name: '天使雕塑', svgKey: 'statue_angel' },
            { id: 'garden_statue_animal', name: '动物雕塑', svgKey: 'statue_animal' },
            { id: 'garden_statue_abstract', name: '抽象雕塑', svgKey: 'statue_abstract' },
        ]
    },
    {
        id: 'garden_gazebo', name: '凉亭', area: 'garden', slot: 'gazebo', cost: { currency: 'gems', amount: 50 }, xpReward: 35, variants: [
            { id: 'garden_gazebo_wood', name: '木亭', svgKey: 'gazebo_wood' },
            { id: 'garden_gazebo_iron', name: '铁艺亭', svgKey: 'gazebo_iron' },
            { id: 'garden_gazebo_vine', name: '藤蔓亭', svgKey: 'gazebo_vine' },
        ]
    },
];

export const DECORATION_MAP: Record<string, DecorationDefinition> = {};
for (const d of DECORATIONS) {
    DECORATION_MAP[d.id] = d;
}

export function getDecorationsForArea(areaId: string): DecorationDefinition[] {
    return DECORATIONS.filter(d => d.area === areaId);
}

export function getUnlockedAreas(level: number) {
    return AREAS.filter(a => level >= a.unlockLevel);
}
