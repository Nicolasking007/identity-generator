"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UploadIcon, CheckIcon, XIcon, UserIcon, PaletteIcon, KeyIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"


interface TokenResult {
    token: string
    isValid: boolean
    message?: string
}

interface Environment {
    name: string
    apiUrl: string
}

const environments: Environment[] = [
    { name: "测试环境", apiUrl: "/api/test" },
    { name: "预生产环境", apiUrl: "/api/beta" },
    { name: "生产环境", apiUrl: "/api/prod" }
]

export default function TokenChecker() {
    const { toast } = useToast()
    const [token, setToken] = useState("")
    const [results, setResults] = useState<TokenResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    const [currentEnv, setCurrentEnv] = useState<Environment>(environments[0])

    // 处理单个token校验
    const handleSingleCheck = async () => {
        if (!token.trim()) {
            toast({ description: "请输入token", variant: "destructive" })
            return
        }

        // 添加格式校验
        if (!isValidTokenFormat(token)) {
            toast({ description: "Token格式无效", variant: "destructive" })
            return
        }

        setIsLoading(true)
        try {
            const result = await checkTokenValidity(token)
            setResults([...results, result])
            setToken("")
        } finally {
            setIsLoading(false)
        }
    }

    // 解析CSV文件
    const parseCSV = (file: File): Promise<string[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            // 添加错误处理
            reader.onerror = () => {
                toast({
                    description: "文件读取失败",
                    variant: "destructive"
                })
                reject(new Error("文件读取失败"))
            }

            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string
                    const lines = content
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0)

                    // 提取每行的token（支持多种分隔符和引号）
                    const tokens = lines.flatMap(line => {
                        // 移除可能的引号
                        const cleanLine = line.replace(/^"|"$/g, '')
                        // 尝试用多种分隔符分割
                        const separators = ['\t', ',', ';']
                        let columns: string[] = []

                        for (const sep of separators) {
                            columns = cleanLine.split(sep)
                            if (columns.length > 1) break
                        }

                        // 查找符合UUID格式的列作为token
                        return columns
                            .map(col => col.trim())
                            .filter(col => isValidTokenFormat(col))
                    }).filter(Boolean) // 过滤掉空值

                    if (tokens.length === 0) {
                        toast({
                            description: "未找到符合格式的Token列",
                            variant: "destructive"
                        })
                        reject(new Error("未找到Token列"))
                        return
                    }

                    resolve(tokens)
                } catch (error) {
                    toast({
                        description: "解析CSV文件时出错",
                        variant: "destructive"
                    })
                    reject(error)
                }
            }
            reader.readAsText(file)
        })
    }

    // 处理CSV文件上传
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsLoading(true)
        try {
            const tokens = await parseCSV(file)
            const checkResults = await Promise.all(tokens.map(checkTokenValidity))
            setResults(checkResults)
        } catch (error) {
            // 错误处理保持不变
        } finally {
            setIsLoading(false)
        }
    }

    // Token格式校验函数
    const isValidTokenFormat = (token: string): boolean => {
        // UUID格式校验正则表达式
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        return uuidRegex.test(token)
    }

    // 模拟token校验API调用
    // 修改checkTokenValidity函数，使用当前环境的apiUrl
    const checkTokenValidity = async (token: string): Promise<TokenResult> => {
        try {
            const response = await fetch(`${currentEnv.apiUrl}/app/train/get/detail`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json;charset=UTF-8",
                    "OS": "H5",
                    "Ver": "1.0.0",
                    "Accept": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    trainId: "1907625535428673537" // You'll need to replace this with actual required fields
                })
            });

            // 首先检查响应内容类型
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                return {
                    token,
                    isValid: false,
                    message: `服务器返回了非JSON响应: ${text.substring(0, 50)}...`
                };
            }

            const data = await response.json();
            return {
                token,
                isValid: data.code === '0000',
                message: data.msg || "请求成功"
            };
        } catch (error) {
            console.error("API请求错误:", error);
            return {
                token,
                isValid: false,
                message: `请求失败: ${error instanceof Error ? error.message : "网络错误"}`
            };
        }
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex gap-6">
                {/* 左侧导航栏 */}
                <div className="w-[200px]">
                    <nav className="space-y-1">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        工具
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 w-[200px]">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/"
                                                    className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${pathname === '/' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                                                >
                                                    <div className="flex items-center">
                                                        <UserIcon className="h-4 w-4 mr-2" />
                                                        身份信息生成器
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/colors"
                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent"
                                                >
                                                    <div className="flex items-center">
                                                        <PaletteIcon className="h-4 w-4 mr-2" />
                                                        常用色卡
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/token-checker"
                                                    className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${pathname === '/token-checker' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                                                >
                                                    <div className="flex items-center">
                                                        <KeyIcon className="h-4 w-4 mr-2" />
                                                        Token校验
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>
                </div>

                {/* 右侧内容区域 */}
                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Token有效性校验</h1>
                        <Select
                            value={currentEnv.name}
                            onValueChange={(value) => {
                                const env = environments.find(e => e.name === value)
                                if (env) setCurrentEnv(env)
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="选择环境" />
                            </SelectTrigger>
                            <SelectContent>
                                {environments.map((env) => (
                                    <SelectItem key={env.name} value={env.name}>
                                        {env.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 单个token输入区域 */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="输入单个token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                        <Button onClick={handleSingleCheck} disabled={isLoading}>
                            {isLoading ? "校验中..." : "校验"}
                        </Button>
                    </div>

                    {/* CSV文件上传区域 */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <UploadIcon className="h-4 w-4" />
                            <span>上传CSV文件</span>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={isLoading}
                            />
                        </label>
                        <p className="text-sm text-muted-foreground">CSV文件每行一个token</p>
                    </div>

                    {/* 结果显示表格 */}
                    {results.length > 0 && (
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">校验结果</h2>
                            <div className="rounded-md border">
                                <div className="max-h-[500px] overflow-y-auto relative">  {/* 添加relative定位 */}
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">  {/* 添加shadow-sm增强效果 */}
                                            <TableRow>
                                                <TableHead className="bg-background">  {/* 确保背景色 */}
                                                    Token
                                                </TableHead>
                                                <TableHead className="bg-background">
                                                    状态
                                                </TableHead>
                                                <TableHead className="bg-background">
                                                    信息
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {results.map((result, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-mono">{result.token}</TableCell>
                                                    <TableCell>
                                                        {result.isValid ? (
                                                            <span className="flex items-center text-green-500">
                                                                <CheckIcon className="h-4 w-4 mr-1" /> 有效
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center text-red-500">
                                                                <XIcon className="h-4 w-4 mr-1" /> 无效
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{result.message}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

