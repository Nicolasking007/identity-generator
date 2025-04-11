"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyIcon, RefreshCwIcon as RefreshIcon, DownloadIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { faker } from "@faker-js/faker/locale/zh_CN"
import { UserIcon, PaletteIcon, KeyIcon } from "lucide-react"
import Link from "next/link"

interface Identity {
  id: number
  name: string
  gender: string
  idNumber: string
  birthDate: string
  zodiac: string
  constellation: string
  age: number
  region: string
  areaCode: string
  phone: string
  bankCard: string
  bank: string
}

// 省份和城市的映射
const provinceCityMap: { [key: string]: string[] } = {
  "11": ["北京"],
  "31": ["上海"],
  "44": [
    "广州",
    "深圳",
    "珠海",
    "汕头",
    "韶关",
    "佛山",
    "江门",
    "湛江",
    "茂名",
    "肇庆",
    "惠州",
    "梅州",
    "汕尾",
    "河源",
    "阳江",
    "清远",
    "东莞",
    "中山",
    "潮州",
    "揭阳",
    "云浮",
  ],
  "33": ["杭州", "宁波", "温州", "嘉兴", "湖州", "绍兴", "金华", "衢州", "舟山", "台州", "丽水"],
}

const provinceMap: { [key: string]: string } = {
  "11": "北京市",
  "31": "上海市",
  "44": "广东省",
  "33": "浙江省",
}

const districtMap: Record<string, Record<string, string[]>> = {
  "11": {
    "01": [
      "东城区",
      "西城区",
      "朝阳区",
      "丰台区",
      "石景山区",
      "海淀区",
      "门头沟区",
      "房山区",
      "通州区",
      "顺义区",
      "昌平区",
      "大兴区",
      "怀柔区",
      "平谷区",
      "密云区",
      "延庆区",
    ],
  },
  "31": {
    "01": [
      "黄浦区",
      "徐汇区",
      "长宁区",
      "静安区",
      "普陀区",
      "虹口区",
      "杨浦区",
      "闵行区",
      "宝山区",
      "嘉定区",
      "浦东新区",
      "金山区",
      "松江区",
      "青浦区",
      "奉贤区",
      "崇明区",
    ],
  },
  "44": {
    "01": [
      "荔湾区",
      "越秀区",
      "海珠区",
      "天河区",
      "白云区",
      "黄埔区",
      "番禺区",
      "花都区",
      "南沙区",
      "从化区",
      "增城区",
    ],
    "03": ["罗湖区", "福田区", "南山区", "宝安区", "龙岗区", "盐田区", "龙华区", "坪山区", "光明区"],
  },
  "33": {
    "01": ["上城区", "下城区", "江干区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区", "富阳区", "临安区"],
    "02": ["海曙区", "江北区", "北仑区", "镇海区", "鄞州区", "奉化区"],
  },
}

const bankPrefixMap: { [key: string]: string } = {
  "621": "中国工商银行",
  "622": "中国农业银行",
  "623": "中国建设银行",
  "625": "中国银行",
  "628": "交通银行",
  "626": "中信银行",
  "627": "中国光大银行",
  "629": "招商银行",
  "630": "中国民生银行",
  "631": "平安银行",
}

export default function IdentityGenerator() {
  const [identities, setIdentities] = useState<Identity[]>([])
  const [count, setCount] = useState(10)
  const [selectedProvince, setSelectedProvince] = useState<string>("11") // 默认值
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    setIdentities(generateMockData(count))
  }, [count, selectedProvince, selectedCity, selectedDistrict])

  function generateMockData(count: number): Identity[] {
    const provinceCode = selectedProvince || "11" // 默认值
    const provinceCityMapEntry = provinceCityMap[provinceCode]
    // Fix: Convert array to object with index keys
    const cityCode = selectedCity || (provinceCityMapEntry && 
        faker.helpers.objectKey(
            provinceCityMapEntry.reduce((obj, city, index) => {
                obj[index] = city;
                return obj;
            }, {} as Record<string, string>)
        ))
    const districtName =
      selectedDistrict ||
        (cityCode && districtMap[provinceCode]?.[cityCode])?.length > 0
        ? faker.helpers.arrayElement(districtMap[provinceCode]?.[cityCode] || [])
        : ""

    return Array.from({ length: count }, (_, i) => {
      const birthDate = faker.date.between({ from: "1940-01-01", to: "2005-12-31" })
      const idNumber = generateIdNumber(provinceCode, cityCode || "01", districtName, birthDate)
      const bankPrefix = faker.helpers.arrayElement(Object.keys(bankPrefixMap))
      const bankCard = bankPrefix + faker.finance.creditCardNumber("############")
      const bank = bankPrefixMap[bankPrefix]

      return {
        id: i + 1,
        name: faker.person.fullName(),
        gender: Number.parseInt(idNumber.charAt(16)) % 2 === 0 ? "女" : "男",
        idNumber: idNumber,
        birthDate: birthDate.toISOString().split("T")[0],
        zodiac: getChineseZodiac(birthDate),
        constellation: getConstellation(birthDate),
        age: new Date().getFullYear() - birthDate.getFullYear(),
        region: `${provinceMap[provinceCode]}${provinceCityMapEntry ? 
            provinceCityMapEntry[Number(cityCode || "01")] : ""}${districtName}`,
        areaCode: provinceCode + faker.number.int({ min: 1000, max: 9999 }).toString(),
        phone: generatePhoneNumber(),
        bankCard: bankCard,
        bank: bank,
      }
    })
  }

  function generateIdNumber(provinceCode: string, cityCode: string, districtName: string, birthDate: Date): string {
    const year = birthDate.getFullYear().toString()
    const month = (birthDate.getMonth() + 1).toString().padStart(2, "0")
    const day = birthDate.getDate().toString().padStart(2, "0")
    const districtCode =
      Object.entries(districtMap[provinceCode]?.[cityCode || "01"] || {}).find(
        ([_, names]) => names.includes(districtName)
      )?.[0] || "01"
    const random = faker.number.int({ min: 10, max: 99 }).toString()
    const gender = faker.number.int({ min: 0, max: 9 }).toString()
    const checksum = faker.number.int({ min: 0, max: 9 }).toString()
    return `${provinceCode}${cityCode}${districtCode}${year}${month}${day}${random}${gender}${checksum}`
  }

  function generatePhoneNumber(): string {
    const prefixes = [
      "130",
      "131",
      "132",
      "133",
      "134",
      "135",
      "136",
      "137",
      "138",
      "139",
      "150",
      "151",
      "152",
      "153",
      "155",
      "156",
      "157",
      "158",
      "159",
      "170",
      "176",
      "177",
      "178",
      "180",
      "181",
      "182",
      "183",
      "184",
      "185",
      "186",
      "187",
      "188",
      "189",
    ]
    return faker.helpers.arrayElement(prefixes) + faker.number.int({ min: 10000000, max: 99999999 }).toString()
  }

  function getChineseZodiac(date: Date): string {
    const zodiacSigns = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]
    const year = date.getFullYear()
    return zodiacSigns[(year - 4) % 12]
  }

  function getConstellation(date: Date): string {
    const constellations = [
      "摩羯座",
      "水瓶座",
      "双鱼座",
      "白羊座",
      "金牛座",
      "双子座",
      "巨蟹座",
      "狮子座",
      "处女座",
      "天秤座",
      "天蝎座",
      "射手座",
    ]
    const month = date.getMonth()
    const day = date.getDate()
    const constellationDays = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22]
    return constellations[day < constellationDays[month] ? (month + 11) % 12 : month]
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    toast({
      description: "已复制到剪贴板",
      duration: 2000,
    })
  }

  function handleRefresh() {
    setIdentities(generateMockData(count))
  }

  function handleDownloadJSON() {
    const jsonData = JSON.stringify(identities, null, 2) // 格式化 JSON 数据
    const blob = new Blob([jsonData], { type: "application/json" }) // 创建 Blob 对象
    const url = URL.createObjectURL(blob) // 创建下载链接
    const link = document.createElement("a")
    link.href = url
    link.download = "identities.json" // 设置下载文件名
    link.click()
    URL.revokeObjectURL(url) // 释放 URL 对象
    toast({
      description: "JSON 文件已下载",
      duration: 2000,
    })
  }

  function handleProvinceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const province = e.target.value
    setSelectedProvince(province)
    setSelectedCity("")
    setSelectedDistrict("")
  }

  function handleCityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const city = e.target.value
    setSelectedCity(city)
    setSelectedDistrict("")
  }

  function handleDistrictChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedDistrict(e.target.value)
  }

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
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
            >
              <PaletteIcon className="h-4 w-4" />
              常用色卡
            </Link>
            <Link
              href="/token-checker"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
            >
              <KeyIcon className="h-4 w-4" />
              Token校验
            </Link>
          </nav>
        </div>
        {/* 右侧内容区域 */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">身份信息生成器</h1>
            <div className="flex items-center gap-2">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshIcon className="mr-2 h-4 w-4" />
                重新生成
              </Button>
              <Button onClick={handleDownloadJSON} variant="outline">
                <DownloadIcon className="mr-2 h-4 w-4" />
                下载 JSON
              </Button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="count">生成数量</Label>
              <Input
                id="count"
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                min="1"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="province">省份</Label>
              <select
                id="province"
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full p-2 border rounded"
              >
                {Object.entries(provinceMap).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="city">城市</Label>
              <select
                id="city"
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full p-2 border rounded"
                disabled={!selectedProvince}
              >
                {selectedProvince &&
                  Object.entries(provinceCityMap[selectedProvince]).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>序号</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>性别</TableHead>
                  <TableHead>身份证号</TableHead>
                  <TableHead>出生日期</TableHead>
                  <TableHead>生肖</TableHead>
                  <TableHead>星座</TableHead>
                  <TableHead>年龄</TableHead>
                  <TableHead>地区</TableHead>
                  <TableHead>手机号</TableHead>
                  <TableHead>银行卡号</TableHead>
                  <TableHead>开户行</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {identities.map((identity) => (
                  <TableRow key={identity.id}>
                    <TableCell>{identity.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {identity.name}
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(identity.name)}>
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{identity.gender}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {identity.idNumber}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopy(identity.idNumber)}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{identity.birthDate}</TableCell>
                    <TableCell>{identity.zodiac}</TableCell>
                    <TableCell>{identity.constellation}</TableCell>
                    <TableCell>{identity.age}</TableCell>
                    <TableCell>{identity.region}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {identity.phone}
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(identity.phone)}>
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {identity.bankCard}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopy(identity.bankCard)}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{identity.bank}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}