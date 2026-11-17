// 欢乐伙伴2.0 一年级识读字（共364字，按19课归类）
// 数据格式与 HanziBomb 相同：{ 课次: [{ char, pinyin }] }
// 多音字可在 pinyin 中用空格分隔多个读音，例如 "地": "dì de"
const ALL_LESSONS = {
  "第一课": [
    {
      "char": "二",
      "pinyin": "èr"
    },
    {
      "char": "耳",
      "pinyin": "ěr"
    },
    {
      "char": "口",
      "pinyin": "kǒu"
    },
    {
      "char": "人",
      "pinyin": "rén"
    },
    {
      "char": "五",
      "pinyin": "wǔ"
    },
    {
      "char": "牙",
      "pinyin": "yá"
    },
    {
      "char": "衣",
      "pinyin": "yī"
    },
    {
      "char": "一",
      "pinyin": "yī"
    },
    {
      "char": "鱼",
      "pinyin": "yú"
    },
    {
      "char": "雨",
      "pinyin": "yǔ"
    }
  ],
  "第二课": [
    {
      "char": "爸",
      "pinyin": "bà"
    },
    {
      "char": "八",
      "pinyin": "bā"
    },
    {
      "char": "巴",
      "pinyin": "bā"
    },
    {
      "char": "不",
      "pinyin": "bù"
    },
    {
      "char": "的",
      "pinyin": "de"
    },
    {
      "char": "弟",
      "pinyin": "dì"
    },
    {
      "char": "儿",
      "pinyin": "ér"
    },
    {
      "char": "父",
      "pinyin": "fù"
    },
    {
      "char": "妈",
      "pinyin": "mā"
    },
    {
      "char": "马",
      "pinyin": "mǎ"
    },
    {
      "char": "木",
      "pinyin": "mù"
    },
    {
      "char": "母",
      "pinyin": "mǔ"
    },
    {
      "char": "你",
      "pinyin": "nǐ"
    },
    {
      "char": "女",
      "pinyin": "nǚ"
    },
    {
      "char": "他",
      "pinyin": "tā"
    },
    {
      "char": "她",
      "pinyin": "tā"
    },
    {
      "char": "土",
      "pinyin": "tǔ"
    },
    {
      "char": "我",
      "pinyin": "wǒ"
    },
    {
      "char": "也",
      "pinyin": "yě"
    }
  ],
  "第三课": [
    {
      "char": "个",
      "pinyin": "gè"
    },
    {
      "char": "哥",
      "pinyin": "gē"
    },
    {
      "char": "河",
      "pinyin": "hé"
    },
    {
      "char": "禾",
      "pinyin": "hé"
    },
    {
      "char": "合",
      "pinyin": "hé"
    },
    {
      "char": "和",
      "pinyin": "hé"
    },
    {
      "char": "几",
      "pinyin": "jǐ"
    },
    {
      "char": "句",
      "pinyin": "jù"
    },
    {
      "char": "可",
      "pinyin": "kě"
    },
    {
      "char": "了",
      "pinyin": "le"
    },
    {
      "char": "力",
      "pinyin": "lì"
    },
    {
      "char": "立",
      "pinyin": "lì"
    },
    {
      "char": "吗",
      "pinyin": "ma"
    },
    {
      "char": "米",
      "pinyin": "mǐ"
    },
    {
      "char": "气",
      "pinyin": "qì"
    },
    {
      "char": "七",
      "pinyin": "qī"
    },
    {
      "char": "去",
      "pinyin": "qù"
    },
    {
      "char": "以",
      "pinyin": "yǐ"
    }
  ],
  "第四课": [
    {
      "char": "把",
      "pinyin": "bǎ"
    },
    {
      "char": "车",
      "pinyin": "chē"
    },
    {
      "char": "吃",
      "pinyin": "chī"
    },
    {
      "char": "尺",
      "pinyin": "chǐ"
    },
    {
      "char": "出",
      "pinyin": "chū"
    },
    {
      "char": "己",
      "pinyin": "jǐ"
    },
    {
      "char": "日",
      "pinyin": "rì"
    },
    {
      "char": "士",
      "pinyin": "shì"
    },
    {
      "char": "是",
      "pinyin": "shì"
    },
    {
      "char": "石",
      "pinyin": "shí"
    },
    {
      "char": "十",
      "pinyin": "shí"
    },
    {
      "char": "书",
      "pinyin": "shū"
    },
    {
      "char": "四",
      "pinyin": "sì"
    },
    {
      "char": "它",
      "pinyin": "tā"
    },
    {
      "char": "只",
      "pinyin": "zhī"
    },
    {
      "char": "字",
      "pinyin": "zì"
    },
    {
      "char": "自",
      "pinyin": "zì"
    },
    {
      "char": "子",
      "pinyin": "zǐ"
    }
  ],
  "第五课": [
    {
      "char": "安",
      "pinyin": "ān"
    },
    {
      "char": "半",
      "pinyin": "bàn"
    },
    {
      "char": "包",
      "pinyin": "bāo"
    },
    {
      "char": "草",
      "pinyin": "cǎo"
    },
    {
      "char": "具",
      "pinyin": "jù"
    },
    {
      "char": "老",
      "pinyin": "lǎo"
    },
    {
      "char": "毛",
      "pinyin": "máo"
    },
    {
      "char": "奶",
      "pinyin": "nǎi"
    },
    {
      "char": "三",
      "pinyin": "sān"
    },
    {
      "char": "伞",
      "pinyin": "sǎn"
    },
    {
      "char": "山",
      "pinyin": "shān"
    },
    {
      "char": "师",
      "pinyin": "shī"
    },
    {
      "char": "太",
      "pinyin": "tài"
    },
    {
      "char": "玩",
      "pinyin": "wán"
    },
    {
      "char": "王",
      "pinyin": "wáng"
    },
    {
      "char": "午",
      "pinyin": "wǔ"
    },
    {
      "char": "羊",
      "pinyin": "yáng"
    },
    {
      "char": "阳",
      "pinyin": "yáng"
    },
    {
      "char": "早",
      "pinyin": "zǎo"
    }
  ],
  "第六课": [
    {
      "char": "大",
      "pinyin": "dà"
    },
    {
      "char": "刀",
      "pinyin": "dāo"
    },
    {
      "char": "家",
      "pinyin": "jiā"
    },
    {
      "char": "姐",
      "pinyin": "jiě"
    },
    {
      "char": "哭",
      "pinyin": "kū"
    },
    {
      "char": "来",
      "pinyin": "lái"
    },
    {
      "char": "里",
      "pinyin": "lǐ"
    },
    {
      "char": "苗",
      "pinyin": "miáo"
    },
    {
      "char": "男",
      "pinyin": "nán"
    },
    {
      "char": "鸟",
      "pinyin": "niǎo"
    },
    {
      "char": "上",
      "pinyin": "shàng"
    },
    {
      "char": "田",
      "pinyin": "tián"
    },
    {
      "char": "网",
      "pinyin": "wǎng"
    },
    {
      "char": "下",
      "pinyin": "xià"
    },
    {
      "char": "象",
      "pinyin": "xiàng"
    },
    {
      "char": "笑",
      "pinyin": "xiào"
    },
    {
      "char": "小",
      "pinyin": "xiǎo"
    },
    {
      "char": "爷",
      "pinyin": "yé"
    },
    {
      "char": "在",
      "pinyin": "zài"
    },
    {
      "char": "竹",
      "pinyin": "zhú"
    }
  ],
  "第七课": [
    {
      "char": "笔",
      "pinyin": "bǐ"
    },
    {
      "char": "长",
      "pinyin": "cháng"
    },
    {
      "char": "床",
      "pinyin": "chuáng"
    },
    {
      "char": "多",
      "pinyin": "duō"
    },
    {
      "char": "朵",
      "pinyin": "duǒ"
    },
    {
      "char": "瓜",
      "pinyin": "guā"
    },
    {
      "char": "关",
      "pinyin": "guān"
    },
    {
      "char": "广",
      "pinyin": "guǎng"
    },
    {
      "char": "果",
      "pinyin": "guǒ"
    },
    {
      "char": "画",
      "pinyin": "huà"
    },
    {
      "char": "花",
      "pinyin": "huā"
    },
    {
      "char": "火",
      "pinyin": "huǒ"
    },
    {
      "char": "开",
      "pinyin": "kāi"
    },
    {
      "char": "两",
      "pinyin": "liǎng"
    },
    {
      "char": "面",
      "pinyin": "miàn"
    },
    {
      "char": "片",
      "pinyin": "piàn"
    },
    {
      "char": "少",
      "pinyin": "shǎo"
    },
    {
      "char": "叶",
      "pinyin": "yè"
    }
  ],
  "第八课": [
    {
      "char": "本",
      "pinyin": "běn"
    },
    {
      "char": "厂",
      "pinyin": "chǎng"
    },
    {
      "char": "飞",
      "pinyin": "fēi"
    },
    {
      "char": "工",
      "pinyin": "gōng"
    },
    {
      "char": "见",
      "pinyin": "jiàn"
    },
    {
      "char": "看",
      "pinyin": "kàn"
    },
    {
      "char": "妹",
      "pinyin": "mèi"
    },
    {
      "char": "们",
      "pinyin": "men"
    },
    {
      "char": "门",
      "pinyin": "mén"
    },
    {
      "char": "目",
      "pinyin": "mù"
    },
    {
      "char": "跑",
      "pinyin": "pǎo"
    },
    {
      "char": "舌",
      "pinyin": "shé"
    },
    {
      "char": "身",
      "pinyin": "shēn"
    },
    {
      "char": "手",
      "pinyin": "shǒu"
    },
    {
      "char": "体",
      "pinyin": "tǐ"
    },
    {
      "char": "头",
      "pinyin": "tóu"
    },
    {
      "char": "问",
      "pinyin": "wèn"
    },
    {
      "char": "又",
      "pinyin": "yòu"
    },
    {
      "char": "走",
      "pinyin": "zǒu"
    },
    {
      "char": "足",
      "pinyin": "zú"
    }
  ],
  "第九课": [
    {
      "char": "贝",
      "pinyin": "bèi"
    },
    {
      "char": "虫",
      "pinyin": "chóng"
    },
    {
      "char": "点",
      "pinyin": "diǎn"
    },
    {
      "char": "豆",
      "pinyin": "dòu"
    },
    {
      "char": "弓",
      "pinyin": "gōng"
    },
    {
      "char": "华",
      "pinyin": "huá"
    },
    {
      "char": "今",
      "pinyin": "jīn"
    },
    {
      "char": "井",
      "pinyin": "jǐng"
    },
    {
      "char": "九",
      "pinyin": "jiǔ"
    },
    {
      "char": "粒",
      "pinyin": "lì"
    },
    {
      "char": "六",
      "pinyin": "liù"
    },
    {
      "char": "么",
      "pinyin": "me"
    },
    {
      "char": "牛",
      "pinyin": "niú"
    },
    {
      "char": "什",
      "pinyin": "shén"
    },
    {
      "char": "说",
      "pinyin": "shuō"
    },
    {
      "char": "条",
      "pinyin": "tiáo"
    },
    {
      "char": "文",
      "pinyin": "wén"
    },
    {
      "char": "心",
      "pinyin": "xīn"
    },
    {
      "char": "语",
      "pinyin": "yǔ"
    },
    {
      "char": "支",
      "pinyin": "zhī"
    }
  ],
  "第十课": [
    {
      "char": "白",
      "pinyin": "bái"
    },
    {
      "char": "寸",
      "pinyin": "cùn"
    },
    {
      "char": "地",
      "pinyin": "dì"
    },
    {
      "char": "电",
      "pinyin": "diàn"
    },
    {
      "char": "对",
      "pinyin": "duì"
    },
    {
      "char": "反",
      "pinyin": "fǎn"
    },
    {
      "char": "方",
      "pinyin": "fāng"
    },
    {
      "char": "风",
      "pinyin": "fēng"
    },
    {
      "char": "古",
      "pinyin": "gǔ"
    },
    {
      "char": "好",
      "pinyin": "hǎo"
    },
    {
      "char": "坏",
      "pinyin": "huài"
    },
    {
      "char": "旧",
      "pinyin": "jiù"
    },
    {
      "char": "雷",
      "pinyin": "léi"
    },
    {
      "char": "没",
      "pinyin": "méi"
    },
    {
      "char": "水",
      "pinyin": "shuǐ"
    },
    {
      "char": "天",
      "pinyin": "tiān"
    },
    {
      "char": "有",
      "pinyin": "yǒu"
    },
    {
      "char": "月",
      "pinyin": "yuè"
    },
    {
      "char": "云",
      "pinyin": "yún"
    },
    {
      "char": "正",
      "pinyin": "zhèng"
    }
  ],
  "第十一课": [
    {
      "char": "边",
      "pinyin": "biān"
    },
    {
      "char": "丁",
      "pinyin": "dīng"
    },
    {
      "char": "发",
      "pinyin": "fà"
    },
    {
      "char": "高",
      "pinyin": "gāo"
    },
    {
      "char": "后",
      "pinyin": "hòu"
    },
    {
      "char": "回",
      "pinyin": "huí"
    },
    {
      "char": "甲",
      "pinyin": "jiǎ"
    },
    {
      "char": "间",
      "pinyin": "jiān"
    },
    {
      "char": "末",
      "pinyin": "mò"
    },
    {
      "char": "朋",
      "pinyin": "péng"
    },
    {
      "char": "起",
      "pinyin": "qǐ"
    },
    {
      "char": "前",
      "pinyin": "qián"
    },
    {
      "char": "同",
      "pinyin": "tóng"
    },
    {
      "char": "学",
      "pinyin": "xué"
    },
    {
      "char": "右",
      "pinyin": "yòu"
    },
    {
      "char": "友",
      "pinyin": "yǒu"
    },
    {
      "char": "直",
      "pinyin": "zhí"
    },
    {
      "char": "中",
      "pinyin": "zhōng"
    },
    {
      "char": "周",
      "pinyin": "zhōu"
    },
    {
      "char": "坐",
      "pinyin": "zuò"
    },
    {
      "char": "左",
      "pinyin": "zuǒ"
    }
  ],
  "第十二课": [
    {
      "char": "饱",
      "pinyin": "bǎo"
    },
    {
      "char": "饼",
      "pinyin": "bǐng"
    },
    {
      "char": "菜",
      "pinyin": "cài"
    },
    {
      "char": "采",
      "pinyin": "cǎi"
    },
    {
      "char": "唱",
      "pinyin": "chàng"
    },
    {
      "char": "蛋",
      "pinyin": "dàn"
    },
    {
      "char": "饿",
      "pinyin": "è"
    },
    {
      "char": "饭",
      "pinyin": "fàn"
    },
    {
      "char": "干",
      "pinyin": "gān"
    },
    {
      "char": "歌",
      "pinyin": "gē"
    },
    {
      "char": "狗",
      "pinyin": "gǒu"
    },
    {
      "char": "欢",
      "pinyin": "huān"
    },
    {
      "char": "鸡",
      "pinyin": "jī"
    },
    {
      "char": "猫",
      "pinyin": "māo"
    },
    {
      "char": "青",
      "pinyin": "qīng"
    },
    {
      "char": "肉",
      "pinyin": "ròu"
    },
    {
      "char": "汤",
      "pinyin": "tāng"
    },
    {
      "char": "喜",
      "pinyin": "xǐ"
    },
    {
      "char": "香",
      "pinyin": "xiāng"
    },
    {
      "char": "鸭",
      "pinyin": "yā"
    },
    {
      "char": "元",
      "pinyin": "yuán"
    }
  ],
  "第十三课": [
    {
      "char": "变",
      "pinyin": "biàn"
    },
    {
      "char": "冲",
      "pinyin": "chōng"
    },
    {
      "char": "到",
      "pinyin": "dào"
    },
    {
      "char": "东",
      "pinyin": "dōng"
    },
    {
      "char": "放",
      "pinyin": "fàng"
    },
    {
      "char": "很",
      "pinyin": "hěn"
    },
    {
      "char": "巾",
      "pinyin": "jīn"
    },
    {
      "char": "脸",
      "pinyin": "liǎn"
    },
    {
      "char": "凉",
      "pinyin": "liáng"
    },
    {
      "char": "抹",
      "pinyin": "mā"
    },
    {
      "char": "泡",
      "pinyin": "pào"
    },
    {
      "char": "请",
      "pinyin": "qǐng"
    },
    {
      "char": "刷",
      "pinyin": "shuā"
    },
    {
      "char": "西",
      "pinyin": "xī"
    },
    {
      "char": "洗",
      "pinyin": "xǐ"
    },
    {
      "char": "先",
      "pinyin": "xiān"
    },
    {
      "char": "谢",
      "pinyin": "xiè"
    },
    {
      "char": "要",
      "pinyin": "yào"
    },
    {
      "char": "用",
      "pinyin": "yòng"
    }
  ],
  "第十四课": [
    {
      "char": "被",
      "pinyin": "bèi"
    },
    {
      "char": "穿",
      "pinyin": "chuān"
    },
    {
      "char": "动",
      "pinyin": "dòng"
    },
    {
      "char": "都",
      "pinyin": "dōu"
    },
    {
      "char": "服",
      "pinyin": "fú"
    },
    {
      "char": "还",
      "pinyin": "hái"
    },
    {
      "char": "红",
      "pinyin": "hóng"
    },
    {
      "char": "件",
      "pinyin": "jiàn"
    },
    {
      "char": "快",
      "pinyin": "kuài"
    },
    {
      "char": "那",
      "pinyin": "nà"
    },
    {
      "char": "皮",
      "pinyin": "pí"
    },
    {
      "char": "色",
      "pinyin": "sè"
    },
    {
      "char": "事",
      "pinyin": "shì"
    },
    {
      "char": "拾",
      "pinyin": "shí"
    },
    {
      "char": "收",
      "pinyin": "shōu"
    },
    {
      "char": "双",
      "pinyin": "shuāng"
    },
    {
      "char": "袜",
      "pinyin": "wà"
    },
    {
      "char": "鞋",
      "pinyin": "xié"
    },
    {
      "char": "这",
      "pinyin": "zhè"
    },
    {
      "char": "作",
      "pinyin": "zuò"
    },
    {
      "char": "做",
      "pinyin": "zuò"
    }
  ],
  "第十五课": [
    {
      "char": "办",
      "pinyin": "bàn"
    },
    {
      "char": "抱",
      "pinyin": "bào"
    },
    {
      "char": "臭",
      "pinyin": "chòu"
    },
    {
      "char": "串",
      "pinyin": "chuàn"
    },
    {
      "char": "法",
      "pinyin": "fǎ"
    },
    {
      "char": "甘",
      "pinyin": "gān"
    },
    {
      "char": "喝",
      "pinyin": "hē"
    },
    {
      "char": "斤",
      "pinyin": "jīn"
    },
    {
      "char": "苦",
      "pinyin": "kǔ"
    },
    {
      "char": "买",
      "pinyin": "mǎi"
    },
    {
      "char": "拿",
      "pinyin": "ná"
    },
    {
      "char": "切",
      "pinyin": "qiē"
    },
    {
      "char": "生",
      "pinyin": "shēng"
    },
    {
      "char": "甜",
      "pinyin": "tián"
    },
    {
      "char": "弯",
      "pinyin": "wān"
    },
    {
      "char": "选",
      "pinyin": "xuǎn"
    },
    {
      "char": "圆",
      "pinyin": "yuán"
    },
    {
      "char": "怎",
      "pinyin": "zěn"
    },
    {
      "char": "汁",
      "pinyin": "zhī"
    },
    {
      "char": "重",
      "pinyin": "zhòng"
    },
    {
      "char": "最",
      "pinyin": "zuì"
    }
  ],
  "第十六课": [
    {
      "char": "啊",
      "pinyin": "a"
    },
    {
      "char": "阿",
      "pinyin": "ā"
    },
    {
      "char": "打",
      "pinyin": "dǎ"
    },
    {
      "char": "躲",
      "pinyin": "duǒ"
    },
    {
      "char": "房",
      "pinyin": "fáng"
    },
    {
      "char": "户",
      "pinyin": "hù"
    },
    {
      "char": "会",
      "pinyin": "huì"
    },
    {
      "char": "进",
      "pinyin": "jìn"
    },
    {
      "char": "净",
      "pinyin": "jìng"
    },
    {
      "char": "扫",
      "pinyin": "sǎo"
    },
    {
      "char": "谁",
      "pinyin": "shéi"
    },
    {
      "char": "声",
      "pinyin": "shēng"
    },
    {
      "char": "叔",
      "pinyin": "shū"
    },
    {
      "char": "听",
      "pinyin": "tīng"
    },
    {
      "char": "完",
      "pinyin": "wán"
    },
    {
      "char": "写",
      "pinyin": "xiě"
    },
    {
      "char": "兄",
      "pinyin": "xiōng"
    },
    {
      "char": "业",
      "pinyin": "yè"
    },
    {
      "char": "椅",
      "pinyin": "yǐ"
    },
    {
      "char": "桌",
      "pinyin": "zhuō"
    }
  ],
  "第十七课": [
    {
      "char": "爱",
      "pinyin": "ài"
    },
    {
      "char": "给",
      "pinyin": "gěi"
    },
    {
      "char": "故",
      "pinyin": "gù"
    },
    {
      "char": "国",
      "pinyin": "guó"
    },
    {
      "char": "讲",
      "pinyin": "jiǎng"
    },
    {
      "char": "节",
      "pinyin": "jié"
    },
    {
      "char": "课",
      "pinyin": "kè"
    },
    {
      "char": "乐",
      "pinyin": "lè"
    },
    {
      "char": "每",
      "pinyin": "měi"
    },
    {
      "char": "明",
      "pinyin": "míng"
    },
    {
      "char": "庆",
      "pinyin": "qìng"
    },
    {
      "char": "台",
      "pinyin": "tái"
    },
    {
      "char": "童",
      "pinyin": "tóng"
    },
    {
      "char": "晚",
      "pinyin": "wǎn"
    },
    {
      "char": "为",
      "pinyin": "wèi"
    },
    {
      "char": "星",
      "pinyin": "xīng"
    },
    {
      "char": "因",
      "pinyin": "yīn"
    },
    {
      "char": "祝",
      "pinyin": "zhù"
    },
    {
      "char": "昨",
      "pinyin": "zuó"
    }
  ],
  "第十八课": [
    {
      "char": "带",
      "pinyin": "dài"
    },
    {
      "char": "短",
      "pinyin": "duǎn"
    },
    {
      "char": "孩",
      "pinyin": "hái"
    },
    {
      "char": "黑",
      "pinyin": "hēi"
    },
    {
      "char": "虎",
      "pinyin": "hǔ"
    },
    {
      "char": "话",
      "pinyin": "huà"
    },
    {
      "char": "尖",
      "pinyin": "jiān"
    },
    {
      "char": "叫",
      "pinyin": "jiào"
    },
    {
      "char": "睛",
      "pinyin": "jīng"
    },
    {
      "char": "期",
      "pinyin": "qī"
    },
    {
      "char": "认",
      "pinyin": "rèn"
    },
    {
      "char": "狮",
      "pinyin": "shī"
    },
    {
      "char": "兔",
      "pinyin": "tù"
    },
    {
      "char": "尾",
      "pinyin": "wěi"
    },
    {
      "char": "物",
      "pinyin": "wù"
    },
    {
      "char": "眼",
      "pinyin": "yǎn"
    },
    {
      "char": "园",
      "pinyin": "yuán"
    },
    {
      "char": "再",
      "pinyin": "zài"
    },
    {
      "char": "站",
      "pinyin": "zhàn"
    },
    {
      "char": "爪",
      "pinyin": "zhǎo"
    }
  ],
  "第十九课": [
    {
      "char": "伴",
      "pinyin": "bàn"
    },
    {
      "char": "步",
      "pinyin": "bù"
    },
    {
      "char": "常",
      "pinyin": "cháng"
    },
    {
      "char": "场",
      "pinyin": "chǎng"
    },
    {
      "char": "店",
      "pinyin": "diàn"
    },
    {
      "char": "扶",
      "pinyin": "fú"
    },
    {
      "char": "公",
      "pinyin": "gōng"
    },
    {
      "char": "伙",
      "pinyin": "huǒ"
    },
    {
      "char": "拍",
      "pinyin": "pāi"
    },
    {
      "char": "球",
      "pinyin": "qiú"
    },
    {
      "char": "商",
      "pinyin": "shāng"
    },
    {
      "char": "梯",
      "pinyin": "tī"
    },
    {
      "char": "图",
      "pinyin": "tú"
    },
    {
      "char": "屋",
      "pinyin": "wū"
    },
    {
      "char": "戏",
      "pinyin": "xì"
    },
    {
      "char": "习",
      "pinyin": "xí"
    },
    {
      "char": "校",
      "pinyin": "xiào"
    },
    {
      "char": "兴",
      "pinyin": "xìng"
    },
    {
      "char": "游",
      "pinyin": "yóu"
    },
    {
      "char": "组",
      "pinyin": "zǔ"
    }
  ]
};
