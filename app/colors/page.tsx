"use client"

import { useToast } from "@/components/ui/use-toast"
import { CopyIcon, UserIcon, PaletteIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ColorsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    toast({
      description: "已复制到剪贴板",
      duration: 2000,
    })
  }

  // 100种常用颜色数据
  // 修改颜色数据，移除value属性，直接使用hex
  const colors = [
  // 基础色系
  { name: "纯白", hex: "#ffffff" },
  { name: "纯黑", hex: "#000000" },
  { name: "红色", hex: "#ef4444" },
  { name: "深红", value: "bg-red-700", hex: "#b91c1c" },
  { name: "橙色", value: "bg-orange-500", hex: "#f97316" },
  { name: "深橙", value: "bg-orange-700", hex: "#c2410c" },
  { name: "黄色", value: "bg-yellow-500", hex: "#eab308" },
  { name: "深黄", value: "bg-yellow-700", hex: "#a16207" },
  { name: "绿色", value: "bg-green-500", hex: "#22c55e" },
  { name: "深绿", value: "bg-green-700", hex: "#15803d" },
  { name: "蓝色", value: "bg-blue-500", hex: "#3b82f6" },
  { name: "深蓝", value: "bg-blue-700", hex: "#1d4ed8" },
  { name: "紫色", value: "bg-purple-500", hex: "#a855f7" },
  { name: "深紫", value: "bg-purple-700", hex: "#7e22ce" },
  { name: "粉色", value: "bg-pink-500", hex: "#ec4899" },
  { name: "深粉", value: "bg-pink-700", hex: "#be185d" },
  { name: "灰色", value: "bg-gray-500", hex: "#6b7280" },
  { name: "深灰", value: "bg-gray-700", hex: "#374151" },
  { name: "青色", value: "bg-cyan-500", hex: "#06b6d4" },
  { name: "深青", value: "bg-cyan-700", hex: "#0e7490" },

  // 扩展色系 (80种) - 包括各种色调和明暗变化
  { name: "玫瑰红", value: "bg-rose-500", hex: "#f43f5e" },
  { name: "浅玫瑰", value: "bg-rose-300", hex: "#fda4af" },
  { name: "深玫瑰", value: "bg-rose-700", hex: "#be123c" },
  { name: "琥珀色", value: "bg-amber-500", hex: "#f59e0b" },
  { name: "浅琥珀", value: "bg-amber-300", hex: "#fcd34d" },
  { name: "深琥珀", value: "bg-amber-700", hex: "#b45309" },
  { name: "酸橙色", value: "bg-lime-500", hex: "#84cc16" },
  { name: "浅酸橙", value: "bg-lime-300", hex: "#bef264" },
  { name: "深酸橙", value: "bg-lime-700", hex: "#4d7c0f" },
  { name: "翡翠绿", value: "bg-emerald-500", hex: "#10b981" },
  { name: "浅翡翠", value: "bg-emerald-300", hex: "#6ee7b7" },
  { name: "深翡翠", value: "bg-emerald-700", hex: "#047857" },
  { name: "蓝绿色", value: "bg-teal-500", hex: "#14b8a6" },
  { name: "浅蓝绿", value: "bg-teal-300", hex: "#5eead4" },
  { name: "深蓝绿", value: "bg-teal-700", hex: "#0f766e" },
  { name: "靛蓝色", value: "bg-indigo-500", hex: "#6366f1" },
  { name: "浅靛蓝", value: "bg-indigo-300", hex: "#a5b4fc" },
  { name: "深靛蓝", value: "bg-indigo-700", hex: "#4338ca" },
  { name: "紫红色", value: "bg-fuchsia-500", hex: "#d946ef" },
  { name: "浅紫红", value: "bg-fuchsia-300", hex: "#f0abfc" },
  { name: "深紫红", value: "bg-fuchsia-700", hex: "#a21caf" },
  { name: "暖灰色", value: "bg-stone-500", hex: "#78716c" },
  { name: "浅暖灰", value: "bg-stone-300", hex: "#d6d3d1" },
  { name: "深暖灰", value: "bg-stone-700", hex: "#44403c" },
  { name: "天蓝色", value: "bg-sky-500", hex: "#0ea5e9" },
  { name: "浅天蓝", value: "bg-sky-300", hex: "#7dd3fc" },
  { name: "深天蓝", value: "bg-sky-700", hex: "#0369a1" },
  { name: "紫罗兰", value: "bg-violet-500", hex: "#8b5cf6" },
  { name: "浅紫罗兰", value: "bg-violet-300", hex: "#c4b5fd" },
  { name: "深紫罗兰", value: "bg-violet-700", hex: "#6d28d9" },
  { name: "珊瑚色", value: "bg-coral-500", hex: "#ff7f50" },
  { name: "浅珊瑚", value: "bg-coral-300", hex: "#ffb6a1" },
  { name: "深珊瑚", value: "bg-coral-700", hex: "#e6735c" },
  { name: "薄荷绿", value: "bg-mint-500", hex: "#98ff98" },
  { name: "浅薄荷", value: "bg-mint-300", hex: "#c1ffc1" },
  { name: "深薄荷", value: "bg-mint-700", hex: "#7acc7a" },
  { name: "桃红色", value: "bg-peach-500", hex: "#ffdab9" },
  { name: "浅桃红", value: "bg-peach-300", hex: "#ffe4c4" },
  { name: "深桃红", value: "bg-peach-700", hex: "#cdaf95" },
  { name: "薰衣草", value: "bg-lavender-500", hex: "#e6e6fa" },
  { name: "浅薰衣草", value: "bg-lavender-300", hex: "#f0f0ff" },
  { name: "深薰衣草", value: "bg-lavender-700", hex: "#b8b8d8" },
  { name: "橄榄绿", value: "bg-olive-500", hex: "#808000" },
  { name: "浅橄榄", value: "bg-olive-300", hex: "#b8bc86" },
  { name: "深橄榄", value: "bg-olive-700", hex: "#555a2b" },
  { name: "巧克力色", value: "bg-chocolate-500", hex: "#d2691e" },
  { name: "浅巧克力", value: "bg-chocolate-300", hex: "#e8b38c" },
  { name: "深巧克力", value: "bg-chocolate-700", hex: "#a0522d" },
  { name: "番茄红", value: "bg-tomato-500", hex: "#ff6347" },
  { name: "浅番茄", value: "bg-tomato-300", hex: "#ff8c7a" },
  { name: "深番茄", value: "bg-tomato-700", hex: "#cc4e3d" },
  { name: "孔雀蓝", value: "bg-peacock-500", hex: "#008080" },
  { name: "浅孔雀", value: "bg-peacock-300", hex: "#66b2b2" },
  { name: "深孔雀", value: "bg-peacock-700", hex: "#006666" },
  { name: "金丝雀黄", value: "bg-canary-500", hex: "#ffff99" },
  { name: "浅金丝雀", value: "bg-canary-300", hex: "#ffffcc" },
  { name: "深金丝雀", value: "bg-canary-700", hex: "#cccc7a" },
  { name: "钢青色", value: "bg-steel-500", hex: "#4682b4" },
  { name: "浅钢青", value: "bg-steel-300", hex: "#9fb6cd" },
  { name: "深钢青", value: "bg-steel-700", hex: "#36648b" },
  { name: "砖红色", value: "bg-brick-500", hex: "#b22222" },
  { name: "浅砖红", value: "bg-brick-300", hex: "#cd5c5c" },
  { name: "深砖红", value: "bg-brick-700", hex: "#8b1a1a" },
  { name: "柠檬绿", value: "bg-lemon-500", hex: "#fff44f" },
  { name: "浅柠檬", value: "bg-lemon-300", hex: "#fff78c" },
  { name: "深柠檬", value: "bg-lemon-700", hex: "#d8d647" },
  { name: "咖啡色", value: "bg-coffee-500", hex: "#6f4e37" },
  { name: "浅咖啡", value: "bg-coffee-300", hex: "#a38b80" },
  { name: "深咖啡", value: "bg-coffee-700", hex: "#4b3621" },
  { name: "宝石红", value: "bg-ruby-500", hex: "#e0115f" },
  { name: "浅宝石", value: "bg-ruby-300", hex: "#e67e9f" },
  { name: "深宝石", value: "bg-ruby-700", hex: "#b30c4d" },
  { name: "松石绿", value: "bg-turquoise-500", hex: "#40e0d0" },
  { name: "浅松石", value: "bg-turquoise-300", hex: "#8fe8e0" },
  { name: "深松石", value: "bg-turquoise-700", hex: "#33b8a8" },
  { name: "酒红色", value: "bg-wine-500", hex: "#722f37" },
  { name: "浅酒红", value: "bg-wine-300", hex: "#a05d66" },
  { name: "深酒红", value: "bg-wine-700", hex: "#4d1e26" },
  { name: "海军蓝", value: "bg-navy-500", hex: "#000080" },
  { name: "浅海军", value: "bg-navy-300", hex: "#666699" },
  { name: "深海军", value: "bg-navy-700", hex: "#00004d" },
  { name: "芥末黄", value: "bg-mustard-500", hex: "#ffdb58" },
  { name: "浅芥末", value: "bg-mustard-300", hex: "#ffe78c" },
  { name: "深芥末", value: "bg-mustard-700", hex: "#d8b847" },
  { name: "青铜色", value: "bg-bronze-500", hex: "#cd7f32" },
  { name: "浅青铜", value: "bg-bronze-300", hex: "#e8c39e" },
  { name: "深青铜", value: "bg-bronze-700", hex: "#a0522d" },
  { name: "银灰色", value: "bg-silver-500", hex: "#c0c0c0" },
  { name: "浅银灰", value: "bg-silver-300", hex: "#e0e0e0" },
  { name: "深银灰", value: "bg-silver-700", hex: "#a8a8a8" },
  { name: "香槟金", value: "bg-champagne-500", hex: "#f7e7ce" },
  { name: "浅香槟", value: "bg-champagne-300", hex: "#fff4e0" },
  { name: "深香槟", value: "bg-champagne-700", hex: "#d8c7a8" },
  { name: "玫瑰金", value: "bg-rosegold-500", hex: "#b76e79" },
  { name: "浅玫瑰金", value: "bg-rosegold-300", hex: "#d8a7b0" },
  { name: "深玫瑰金", value: "bg-rosegold-700", hex: "#8c4d56" },
  { name: "珍珠白", value: "bg-pearl-500", hex: "#f8f8ff" },
  { name: "浅珍珠", value: "bg-pearl-300", hex: "#ffffff" },
  { name: "深珍珠", value: "bg-pearl-700", hex: "#e0e0e8" },
  { name: "象牙白", value: "bg-ivory-500", hex: "#fffff0" },
  { name: "浅象牙", value: "bg-ivory-300", hex: "#fffff8" },
  { name: "深象牙", value: "bg-ivory-700", hex: "#e8e8d8" },
  { name: "石板灰", value: "bg-slate-500", hex: "#708090" },
  { name: "浅石板", value: "bg-slate-300", hex: "#a0a8b0" },
  { name: "深石板", value: "bg-slate-700", hex: "#485060" },
  { name: "青铜绿", value: "bg-patina-500", hex: "#639a8f" },
  { name: "浅青铜绿", value: "bg-patina-300", hex: "#8fbdb3" },
  { name: "深青铜绿", value: "bg-patina-700", hex: "#4a7268" },
  { name: "珊瑚粉", value: "bg-coralf-500", hex: "#ff7f7f" },
  { name: "浅珊瑚粉", value: "bg-coralf-300", hex: "#ffb6b6" },
  { name: "深珊瑚粉", value: "bg-coralf-700", hex: "#cc6666" },
  { name: "孔雀石绿", value: "bg-malachite-500", hex: "#0bda51" },
  { name: "浅孔雀石", value: "bg-malachite-300", hex: "#5ce68a" },
  { name: "深孔雀石", value: "bg-malachite-700", hex: "#09a03a" },
  { name: "钴蓝色", value: "bg-cobalt-500", hex: "#0047ab" },
  { name: "浅钴蓝", value: "bg-cobalt-300", hex: "#6699cc" },
  { name: "深钴蓝", value: "bg-cobalt-700", hex: "#003366" },
  { name: "朱红色", value: "bg-vermillion-500", hex: "#e34234" },
  { name: "浅朱红", value: "bg-vermillion-300", hex: "#e67e74" },
  { name: "深朱红", value: "bg-vermillion-700", hex: "#b32b1f" },
  { name: "赤土色", value: "bg-terracotta-500", hex: "#e2725b" },
  { name: "浅赤土", value: "bg-terracotta-300", hex: "#e8a899" },
  { name: "深赤土", value: "bg-terracotta-700", hex: "#b85c4a" },
  { name: "藏红花", value: "bg-saffron-500", hex: "#f4c430" },
  { name: "浅藏红", value: "bg-saffron-300", hex: "#f8d97c" },
  { name: "深藏红", value: "bg-saffron-700", hex: "#c9a227" },
  { name: "紫水晶", value: "bg-amethyst-500", hex: "#9966cc" },
  { name: "浅紫晶", value: "bg-amethyst-300", hex: "#c4a6e0" },
  { name: "深紫晶", value: "bg-amethyst-700", hex: "#7d4d99" },
  { name: "翡翠蓝", value: "bg-jade-500", hex: "#00a86b" },
  { name: "浅翡翠蓝", value: "bg-jade-300", hex: "#5cd6a7" },
  { name: "深翡翠蓝", value: "bg-jade-700", hex: "#007a4d" },
  { name: "珊瑚橙", value: "bg-coralo-500", hex: "#ff7f50" },
  { name: "浅珊瑚橙", value: "bg-coralo-300", hex: "#ffb6a1" },
  { name: "深珊瑚橙", value: "bg-coralo-700", hex: "#e6735c" },
  { name: "橄榄石", value: "bg-peridot-500", hex: "#b4c424" },
  { name: "浅橄榄石", value: "bg-peridot-300", hex: "#d1e05f" },
  { name: "深橄榄石", value: "bg-peridot-700", hex: "#8f9e1b" },
  { name: "蓝宝石", value: "bg-sapphire-500", hex: "#082567" },
  { name: "浅蓝宝石", value: "bg-sapphire-300", hex: "#5d8aa8" },
  { name: "深蓝宝石", value: "bg-sapphire-700", hex: "#051d40" },
  { name: "石榴红", value: "bg-garnet-500", hex: "#831d1c" },
  { name: "浅石榴", value: "bg-garnet-300", hex: "#a85c5b" },
  { name: "深石榴", value: "bg-garnet-700", hex: "#5c0b0a" },
  { name: "黄水晶", value: "bg-citrine-500", hex: "#e4d00a" },
  { name: "浅黄晶", value: "bg-citrine-300", hex: "#f0e68c" },
  { name: "深黄晶", value: "bg-citrine-700", hex: "#b8a807" },
  { name: "孔雀蓝", value: "bg-peacock-500", hex: "#008080" },
  { name: "浅孔雀", value: "bg-peacock-300", hex: "#66b2b2" },
  { name: "深孔雀", value: "bg-peacock-700", hex: "#006666" },
  { name: "巧克力色", value: "bg-chocolate-500", hex: "#d2691e" },
  { name: "浅巧克力", value: "bg-chocolate-300", hex: "#e8b38c" },
  { name: "深巧克力", value: "bg-chocolate-700", hex: "#a0522d" },
  { name: "番茄红", value: "bg-tomato-500", hex: "#ff6347" },
  { name: "浅番茄", value: "bg-tomato-300", hex: "#ff8c7a" },
  { name: "深番茄", value: "bg-tomato-700", hex: "#cc4e3d" },
  ]

  // 过滤颜色列表
  const filteredColors = colors.filter(color => 
    color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    color.hex.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-6">
        {/* 左侧导航栏 */}
        <div className="w-[200px]">
          <nav className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
            >
              <UserIcon className="h-4 w-4" />
              身份信息生成器
            </Link>
            <Link
              href="/colors"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 bg-gray-100 transition-all"
            >
              <PaletteIcon className="h-4 w-4" />
              常用色卡
            </Link>
          </nav>
        </div>

        {/* 右侧内容区域 */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">100种常用色卡</h1>
            <p className="text-muted-foreground">点击颜色可复制色值</p>
          </div>

          {/* 添加搜索和筛选功能 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜索颜色名称或色值..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 显示搜索结果数量 */}
          {searchTerm && (
            <div className="mb-2 text-sm text-muted-foreground">
              找到 {filteredColors.length} 个匹配的颜色
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredColors.map((color) => (
              <div
                key={color.hex}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                onClick={() => handleCopy(color.hex)}
              >
                <div 
                  className="h-16 w-full rounded" 
                  style={{ backgroundColor: color.hex }}
                />
                <span className="font-medium">{color.name}</span>
                <span className="text-sm text-muted-foreground">{color.hex}</span>
              </div>
            ))}
          </div>

          {/* 无结果提示 */}
          {filteredColors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              没有找到匹配的颜色
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
