import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Copy,
  Download,
  Expand,
  History,
  Lightbulb,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Send,
  Share2,
  Terminal,
  Timer,
  Trash2,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type Language =
  | "python"
  | "javascript"
  | "java"
  | "cpp"
  | "c"
  | "sql"
  | "html"
  | "css"
  | "bash"
  | "kotlin"
  | "go";

type Theme = "vscode-dark" | "light" | "dracula";
type PracticeMode = "practice" | "interview" | "contest";
type AIMode = "beginner" | "interview" | "debug" | "optimization";
type OutputStatus = "idle" | "running" | "success" | "error" | "submitted";

interface HistoryEntry {
  id: string;
  language: Language;
  code: string;
  timestamp: number;
  status: "passed" | "failed" | "practice" | "error";
  score?: number;
  execTime?: number;
}

interface TestResult {
  id: number;
  passed: boolean;
  input: string;
  expected: string;
  got: string;
}

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// ─── Language Config ──────────────────────────────────────────────────────────
const LANG_LABELS: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
  c: "C",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  bash: "Bash",
  kotlin: "Kotlin",
  go: "Go",
};

const LANG_EXTENSIONS: Record<Language, string> = {
  python: "py",
  javascript: "js",
  java: "java",
  cpp: "cpp",
  c: "c",
  sql: "sql",
  html: "html",
  css: "css",
  bash: "sh",
  kotlin: "kt",
  go: "go",
};

const STARTER_CODE: Record<Language, string> = {
  python: `# Python Starter Code
def solve(n: int) -> int:
    """
    Given n, return the sum of 1..n
    """
    return sum(range(1, n + 1))

# Test the function
n = int(input("Enter n: "))
result = solve(n)
print(f"Sum of 1 to {n} = {result}")
`,
  javascript: `// JavaScript Starter Code
function solve(n) {
  // Return the sum of 1..n
  return (n * (n + 1)) / 2;
}

const n = 10;
const result = solve(n);
console.log(\`Sum of 1 to \${n} = \${result}\`);
`,
  java: `// Java Starter Code
import java.util.Scanner;

public class Main {
    public static int solve(int n) {
        return n * (n + 1) / 2;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter n: ");
        int n = sc.nextInt();
        System.out.println("Sum of 1 to " + n + " = " + solve(n));
    }
}
`,
  cpp: `// C++ Starter Code
#include <iostream>
using namespace std;

int solve(int n) {
    return n * (n + 1) / 2;
}

int main() {
    int n;
    cout << "Enter n: ";
    cin >> n;
    cout << "Sum of 1 to " << n << " = " << solve(n) << endl;
    return 0;
}
`,
  c: `// C Starter Code
#include <stdio.h>

int solve(int n) {
    return n * (n + 1) / 2;
}

int main() {
    int n;
    printf("Enter n: ");
    scanf("%d", &n);
    printf("Sum of 1 to %d = %d\\n", n, solve(n));
    return 0;
}
`,
  sql: `-- SQL Starter Code (Oracle SQL)
-- Find all employees with salary > 50000

SELECT 
    e.employee_id,
    e.first_name || ' ' || e.last_name AS full_name,
    e.salary,
    d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.salary > 50000
ORDER BY e.salary DESC;
`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 { color: #333; }
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Hello, World!</h1>
        <p>Welcome to my HTML page.</p>
        <button onclick="alert('Clicked!')">Click Me</button>
    </div>
</body>
</html>
`,
  css: `/* CSS Starter Code */

/* Reset */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* Variables */
:root {
    --primary: #6366f1;
    --secondary: #8b5cf6;
    --background: #f8fafc;
    --text: #1e293b;
    --radius: 8px;
}

/* Layout */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.card {
    background: white;
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
}
`,
  bash: `#!/bin/bash
# Bash Starter Script

echo "=== System Info ==="
echo "Hostname: $(hostname)"
echo "OS: $(uname -s)"
echo "Date: $(date)"
echo "User: $(whoami)"

echo ""
echo "=== Disk Usage ==="
df -h / | tail -1

echo ""
echo "=== Memory ==="
free -h 2>/dev/null || echo "Memory info not available"

echo ""
echo "Hello, Bash scripting!"
`,
  kotlin: [
    "// Kotlin Starter Code",
    "fun solve(n: Int): Int {",
    "    return n * (n + 1) / 2",
    "}",
    "",
    "fun main() {",
    '    print("Enter n: ")',
    "    val n = readLine()?.toIntOrNull() ?: 10",
    "    val result = solve(n)",
    '    println("Sum of 1 to $n = $result")',
    "",
    "    // Kotlin features demo",
    "    val list = (1..n).toList()",
    '    println("List sum: ${list.sum()}")',
    '    println("Even numbers: ${list.filter { it % 2 == 0 }}")',
    "}",
  ].join("\n"),
  go: [
    "// Go Starter Code",
    "package main",
    "",
    "import (",
    '    "fmt"',
    ")",
    "",
    "func solve(n int) int {",
    "    return n * (n + 1) / 2",
    "}",
    "",
    "func main() {",
    "    var n int",
    '    fmt.Print("Enter n: ")',
    "    fmt.Scan(&n)",
    "",
    "    result := solve(n)",
    '    fmt.Printf("Sum of 1 to %d = %d\\n", n, result)',
    "}",
  ].join("\n"),
};

// ─── Mock Test Cases ──────────────────────────────────────────────────────────
const MOCK_TEST_CASES: TestResult[] = [
  { id: 1, passed: false, input: "5", expected: "15", got: "" },
  { id: 2, passed: false, input: "10", expected: "55", got: "" },
  { id: 3, passed: false, input: "100", expected: "5050", got: "" },
];

// ─── Leaderboard Data ─────────────────────────────────────────────────────────
const LEADERBOARD = [
  { rank: 1, name: "Priya Sharma", score: 100, time: "2:34", badge: "🥇" },
  { rank: 2, name: "Arjun Patel", score: 95, time: "3:12", badge: "🥈" },
  { rank: 3, name: "Sneha Kumar", score: 90, time: "4:01", badge: "🥉" },
  { rank: 4, name: "Ravi Verma", score: 85, time: "5:22", badge: "4️⃣" },
  { rank: 5, name: "Meera Singh", score: 80, time: "6:45", badge: "5️⃣" },
];

// ─── Hint System ──────────────────────────────────────────────────────────────
const HINTS = [
  "💡 Hint 1: Think about what formula gives you the sum of 1 to n directly without a loop.",
  "💡 Hint 2: The formula is n*(n+1)/2. This is O(1) time complexity vs O(n) for a loop.",
  "💡 Hint 3: Final answer: `return n * (n + 1) / 2;` — This is Gauss's formula from 1784.",
];

// ─── AI Response Generator ────────────────────────────────────────────────────
function generateAIResponse(
  action: string,
  code: string,
  mode: AIMode,
  userMsg?: string,
): string {
  const lang = code.includes("def ")
    ? "Python"
    : code.includes("public class")
      ? "Java"
      : "your language";
  const isBeginnerMode = mode === "beginner";
  const isDebugMode = mode === "debug";
  const isOptMode = mode === "optimization";

  if (action === "explain") {
    if (isBeginnerMode) {
      return `## Code Explanation (Beginner Mode)

Let me walk through this code step by step! 🎓

**What the code does:**
This code solves the problem of finding the sum from 1 to n.

**Line by line breakdown:**
1. \`def solve(n)\` — This defines a function named \`solve\` that takes one parameter \`n\`
2. \`return sum(range(1, n+1))\` — This creates numbers from 1 to n and adds them all up
3. The \`input()\` call — This asks the user to type a number
4. \`print()\` — This shows the answer on screen

**Key Concepts:**
- **Functions**: Like a recipe — you give it ingredients (n), it returns a result
- **Range**: Creates a sequence like [1, 2, 3, ... n]
- **Sum**: Adds all numbers together

**Time Complexity:** O(n) — the program does n operations
**Space Complexity:** O(1) — uses very little extra memory

Try changing n to different values and see what happens! 😊`;
    }
    return `## Code Analysis

**Function:** \`solve(n)\` computes the sum of integers 1 through n.

**Approach:** Iterative summation using built-in \`sum(range())\`
- Time: O(n) | Space: O(n) due to range materialization

**Logic Flow:**
\`\`\`
Input n → range(1, n+1) → [1,2,...,n] → sum → return result
\`\`\`

**Improvement:** Use Gauss's formula for O(1) complexity:
\`\`\`python
return n * (n + 1) // 2
\`\`\``;
  }

  if (action === "error" || isDebugMode) {
    return `## Error Analysis 🔍

**Scanning code for issues...**

✅ No syntax errors detected
✅ No undefined variables found
✅ Logic appears correct for basic cases

**Potential edge cases to handle:**
- What if n = 0? → Returns 0 ✓
- What if n is negative? → May return unexpected results ⚠️
- What if n is very large (>10^9)? → Integer overflow risk in some languages ⚠️

**Suggested Fix:**
\`\`\`python
def solve(n: int) -> int:
    if n < 0:
        raise ValueError("n must be non-negative")
    return n * (n + 1) // 2  # Use integer division
\`\`\`

**Debug tip:** Add \`print(f"Debug: n={n}")\` before return to trace values.`;
  }

  if (action === "optimize" || isOptMode) {
    return `## Optimization Report ⚡

**Current Complexity:**
- Time: O(n) — loops through all numbers
- Space: O(n) — creates a list in memory

**Optimized Version:**
\`\`\`python
def solve(n: int) -> int:
    # Gauss formula: O(1) time, O(1) space
    return n * (n + 1) // 2
\`\`\`

**Performance Gain:**
| n | Current | Optimized |
|---|---------|-----------|
| 100 | 100 ops | 1 op |
| 1M | 1M ops | 1 op |
| 1B | 1B ops | 1 op |

**Why it works:** Carl Friedrich Gauss discovered this formula at age 9.
The sum 1+2+...+n = n×(n+1)/2

**Benchmark:** ~1000x faster for n=10,000`;
  }

  if (action === "convert") {
    return `## Language Conversion 🔄

Here's your code converted to multiple languages:

**JavaScript:**
\`\`\`javascript
function solve(n) {
    return n * (n + 1) / 2;
}
console.log(solve(10)); // 55
\`\`\`

**Java:**
\`\`\`java
public static int solve(int n) {
    return n * (n + 1) / 2;
}
\`\`\`

**C++:**
\`\`\`cpp
int solve(int n) {
    return n * (n + 1) / 2;
}
\`\`\`

**Go:**
\`\`\`go
func solve(n int) int {
    return n * (n + 1) / 2
}
\`\`\``;
  }

  if (action === "testcases") {
    return `## Generated Test Cases 🧪

\`\`\`python
import unittest

class TestSolve(unittest.TestCase):
    
    def test_basic(self):
        self.assertEqual(solve(5), 15)
    
    def test_ten(self):
        self.assertEqual(solve(10), 55)
    
    def test_zero(self):
        self.assertEqual(solve(0), 0)
    
    def test_one(self):
        self.assertEqual(solve(1), 1)
    
    def test_large(self):
        self.assertEqual(solve(100), 5050)
    
    def test_negative(self):
        # Should handle gracefully
        with self.assertRaises(ValueError):
            solve(-1)

if __name__ == '__main__':
    unittest.main()
\`\`\`

**Edge Cases Covered:**
- ✅ n = 0 (base case)
- ✅ n = 1 (single element)  
- ✅ Normal values (5, 10)
- ✅ Large values (100)
- ✅ Negative input (error case)`;
  }

  if (action === "complexity") {
    return `## Complexity Analysis 📊

### Time Complexity: O(n)

**Breakdown by operation:**
\`\`\`
range(1, n+1)  → O(n) — creates sequence
sum(...)       → O(n) — iterates and adds
input/print    → O(1) — constant time I/O
─────────────────────
Total          → O(n)
\`\`\`

### Space Complexity: O(n)
- \`range()\` in Python 3 is lazy (O(1))
- But if converted to list: O(n)

### Optimized: O(1) / O(1)
\`\`\`python
return n * (n + 1) // 2
\`\`\`

### Comparison
| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Loop sum | O(n) | O(1) | Small n |
| Range+sum | O(n) | O(1) | Readable |
| Gauss formula | O(1) | O(1) | Production ✅ |`;
  }

  if (action === "comments") {
    return `## Code with Comments Added 💬

\`\`\`python
# ═══════════════════════════════════════════
# Problem: Sum of integers from 1 to n
# Approach: Built-in range + sum
# Time: O(n) | Space: O(1)
# ═══════════════════════════════════════════

def solve(n: int) -> int:
    """
    Calculate sum of all integers from 1 to n.
    
    Args:
        n: Upper bound (inclusive), must be >= 0
    
    Returns:
        Sum of integers 1 + 2 + ... + n
    
    Examples:
        >>> solve(5)
        15
        >>> solve(10)
        55
    """
    # Generate range [1, 2, ..., n] and sum all elements
    # range(1, n+1) excludes n+1, so we get 1 to n inclusive
    return sum(range(1, n + 1))

# ─── Main execution ───────────────────────
# Read input from user (string → int conversion)
n = int(input("Enter n: "))

# Call solver and display formatted result
result = solve(n)
print(f"Sum of 1 to {n} = {result}")  # f-string for clean formatting
\`\`\``;
  }

  if (action === "dryrun") {
    return `## Dry Run Trace 🔍

**Input:** n = 5

**Step-by-step execution:**

\`\`\`
Call: solve(5)
  │
  ├── range(1, 6) creates: [1, 2, 3, 4, 5]
  │
  ├── sum([1, 2, 3, 4, 5])
  │     └── 1 + 2 = 3
  │     └── 3 + 3 = 6  
  │     └── 6 + 4 = 10
  │     └── 10 + 5 = 15
  │
  └── return 15

n = int("5")  → n = 5
result = solve(5)  → result = 15
print("Sum of 1 to 5 = 15")
\`\`\`

**Variable state at each step:**
| Step | Variable | Value |
|------|----------|-------|
| 1 | n | 5 |
| 2 | range | [1,2,3,4,5] |
| 3 | running_sum | 0→1→3→6→10→15 |
| 4 | result | 15 |

**Output:** \`Sum of 1 to 5 = 15\` ✅`;
  }

  if (userMsg) {
    const lower = userMsg.toLowerCase();
    if (lower.includes("bubble sort")) {
      return `## Bubble Sort Implementation 🫧

\`\`\`${lang}
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break  # Already sorted
    return arr

# Test
nums = [64, 34, 25, 12, 22, 11, 90]
print("Sorted:", bubble_sort(nums))
\`\`\`

**Time Complexity:** O(n²) average/worst, O(n) best
**Space Complexity:** O(1) — in-place
**Stable:** Yes`;
    }
    if (lower.includes("binary search")) {
      return `## Binary Search 🔍

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid          # Found!
        elif arr[mid] < target:
            left = mid + 1      # Search right half
        else:
            right = mid - 1     # Search left half
    
    return -1  # Not found

# Test
nums = [1, 3, 5, 7, 9, 11, 13, 15]
target = 7
idx = binary_search(nums, target)
print(f"Found {target} at index {idx}")
\`\`\`

**Time:** O(log n) | **Space:** O(1)`;
    }
    return `## AI Response

I understand you're asking about: **"${userMsg}"**

${isBeginnerMode ? `**Beginner Explanation:**\nGreat question! Let me break this down in simple terms.\n\nWhen working with ${lang}, understanding the fundamentals is key. Here's what you need to know:\n\n1. **Start with the basics** — Make sure you understand variables, loops, and functions first\n2. **Practice regularly** — Solve at least 2-3 problems daily\n3. **Read the error messages** — They tell you exactly what went wrong\n\nFor placement preparation, focus on:\n- Array and string manipulation\n- Time and space complexity\n- Common patterns (two pointers, sliding window, etc.)\n\nKeep practicing! 💪` : `**Answer:**\nFor placement interviews, ${userMsg.includes("time") ? "time complexity analysis requires identifying the dominant operation in loops" : "focus on pattern recognition and optimal approaches"}.\n\nKey insight: Most interview problems can be solved with 5-10 core patterns. Master those first.\n\nWould you like me to elaborate on any specific aspect?`}`;
  }

  return `I'm ready to help with your ${lang} code! Use the quick action buttons above to get started, or type your question below.`;
}

// ─── Simulate Code Execution ──────────────────────────────────────────────────
async function simulateExecution(
  code: string,
  language: Language,
  customInput: string,
): Promise<{
  output: string;
  error: string | null;
  errorLine: number | null;
  execTime: number;
  memoryMB: number;
}> {
  const execTime = Math.floor(Math.random() * 900) + 100;
  const memoryMB = Math.floor(Math.random() * 28) + 4;

  await new Promise((r) => setTimeout(r, execTime));

  // JavaScript: actually execute it
  if (language === "javascript") {
    try {
      const logs: string[] = [];
      const fakeConsole = {
        log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
        error: (...args: unknown[]) =>
          logs.push(`[ERR] ${args.map(String).join(" ")}`),
      };
      // eslint-disable-next-line no-new-func
      const fn = new Function("console", "input", code);
      fn(fakeConsole, customInput || "10");
      return {
        output: logs.join("\n") || "(no output)",
        error: null,
        errorLine: null,
        execTime,
        memoryMB,
      };
    } catch (e) {
      const err = e as Error;
      const lineMatch = err.stack?.match(/<anonymous>:(\d+)/);
      const errorLine = lineMatch ? Number.parseInt(lineMatch[1]) - 2 : 1;
      return {
        output: "",
        error: err.message,
        errorLine,
        execTime,
        memoryMB,
      };
    }
  }

  // HTML: show preview note
  if (language === "html") {
    const tags = (code.match(/<[a-z]+/gi) || []).slice(0, 8).join(", ");
    return {
      output: `[HTML Preview]\nYour HTML has been processed.\nOpen in a browser to see the full visual output.\n\nTags found: ${tags}`,
      error: null,
      errorLine: null,
      execTime,
      memoryMB,
    };
  }

  // SQL: simulate query result
  if (language === "sql") {
    return {
      output: `Query executed successfully.

EMPLOYEE_ID | FULL_NAME         | SALARY    | DEPARTMENT_NAME
------------|-------------------|-----------|----------------
        101 | John Smith        | $95,000   | Engineering
        102 | Sarah Johnson     | $87,000   | Product
        103 | Raj Patel         | $82,000   | Data Science
        104 | Lisa Chen         | $78,000   | Marketing

4 rows selected. (${execTime}ms)`,
      error: null,
      errorLine: null,
      execTime,
      memoryMB,
    };
  }

  // CSS: simulate
  if (language === "css") {
    const rules = (code.match(/\{[^}]*\}/g) || []).length;
    return {
      output: `CSS parsed successfully.\n${rules} rule${rules !== 1 ? "s" : ""} found.\nNo syntax errors detected.\nCompatibility: Chrome 120+, Firefox 121+, Safari 17+`,
      error: null,
      errorLine: null,
      execTime,
      memoryMB,
    };
  }

  // Bash
  if (language === "bash") {
    return {
      output: `=== System Info ===
Hostname: placement-prep-server
OS: Linux
Date: ${new Date().toString()}
User: student

=== Disk Usage ===
/dev/sda1  20G  8.2G  11G  43% /

=== Memory ===
Total: 8.0Gi  Used: 3.2Gi  Free: 4.8Gi

Hello, Bash scripting!`,
      error: null,
      errorLine: null,
      execTime,
      memoryMB,
    };
  }

  // Default simulation for C, C++, Java, Python, Kotlin, Go
  const inputVal = customInput.trim() || "10";
  const n = Number.parseInt(inputVal) || 10;
  const sum = (n * (n + 1)) / 2;

  // Simulate occasional errors for realism
  if (code.includes("SyntaxError") || code.includes("COMPILE_ERROR")) {
    return {
      output: "",
      error: `Compilation Error: unexpected token at line 5\n  Expected ';' before '}'`,
      errorLine: 5,
      execTime,
      memoryMB,
    };
  }

  return {
    output: `Enter n: ${n}\nSum of 1 to ${n} = ${sum}\n\nProcess finished with exit code 0`,
    error: null,
    errorLine: null,
    execTime,
    memoryMB,
  };
}

// ─── Theme Styles ─────────────────────────────────────────────────────────────
const THEME_STYLES = {
  "vscode-dark": {
    bg: "#1e1e1e",
    panel: "#252526",
    border: "#3e3e42",
    text: "#d4d4d4",
    statusBg: "#007acc",
    statusText: "#ffffff",
    label: "VS Code Dark",
  },
  light: {
    bg: "#ffffff",
    panel: "#f3f3f3",
    border: "#e5e7eb",
    text: "#1f2937",
    statusBg: "#007acc",
    statusText: "#ffffff",
    label: "Light",
  },
  dracula: {
    bg: "#282a36",
    panel: "#21222c",
    border: "#44475a",
    text: "#f8f8f2",
    statusBg: "#bd93f9",
    statusText: "#282a36",
    label: "Dracula",
  },
};

// ─── Format timestamp ─────────────────────────────────────────────────────────
function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

// ─── CodeEditor Component ─────────────────────────────────────────────────────
export function CodeEditor() {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(STARTER_CODE.python);
  const [theme, setTheme] = useState<Theme>("vscode-dark");
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("practice");
  const [aiMode, setAIMode] = useState<AIMode>("beginner");
  const [outputStatus, setOutputStatus] = useState<OutputStatus>("idle");
  const [outputText, setOutputText] = useState("");
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [memoryMB, setMemoryMB] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [aiMessages, setAIMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Code Assistant. Use the quick actions above or ask me anything about your code, algorithms, or placements!",
      timestamp: Date.now(),
    },
  ]);
  const [aiInput, setAIInput] = useState("");
  const [aiTyping, setAITyping] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem("ppp_code_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30 * 60);
  const [activeRightTab, setActiveRightTab] = useState("output");
  const [mobilePanelView, setMobilePanelView] = useState<"editor" | "output">(
    "editor",
  );
  const [score, setScore] = useState<number | null>(null);

  const aiScrollRef = useRef<HTMLDivElement>(null);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-save every 10 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      localStorage.setItem(
        "ppp_code_autosave",
        JSON.stringify({ code, language }),
      );
    }, 10000);
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [code, language]);

  // Interview timer
  useEffect(() => {
    if (practiceMode === "interview" && timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev >= timerDuration) {
            setTimerRunning(false);
            toast.error("⏰ Time's up! Interview session ended.");
            return timerDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [practiceMode, timerRunning, timerDuration]);

  // Scroll AI messages to bottom
  // biome-ignore lint/correctness/useExhaustiveDependencies: ref is stable
  useEffect(() => {
    if (aiScrollRef.current) {
      aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
    }
  }, [aiMessages, aiTyping]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(
      "ppp_code_history",
      JSON.stringify(history.slice(0, 20)),
    );
  }, [history]);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang]);
    setOutputStatus("idle");
    setOutputText("");
    setErrorLine(null);
    setExecTime(null);
    setMemoryMB(null);
    setTestResults([]);
    setScore(null);
  }, []);

  const handleRunCode = useCallback(async () => {
    setOutputStatus("running");
    setOutputText("");
    setErrorLine(null);
    setActiveRightTab("output");
    if (window.innerWidth < 1024) setMobilePanelView("output");

    const result = await simulateExecution(code, language, customInput);
    setExecTime(result.execTime);
    setMemoryMB(result.memoryMB);

    if (result.error) {
      setOutputStatus("error");
      setOutputText(result.error);
      setErrorLine(result.errorLine);
    } else {
      setOutputStatus("success");
      setOutputText(result.output);
    }

    // Save to history
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      language,
      code,
      timestamp: Date.now(),
      status: result.error ? "error" : "practice",
      execTime: result.execTime,
    };
    setHistory((prev) => [entry, ...prev.slice(0, 19)]);
  }, [code, language, customInput]);

  const handleSubmit = useCallback(async () => {
    setOutputStatus("running");
    setOutputText("Running against test cases...");
    setActiveRightTab("output");
    if (window.innerWidth < 1024) setMobilePanelView("output");

    await new Promise((r) => setTimeout(r, 1500));

    // Simulate test results — pass if code is reasonable
    const hasFormula =
      code.includes("*") && (code.includes("+") || code.includes("1"));
    const results: TestResult[] = MOCK_TEST_CASES.map((tc, i) => ({
      ...tc,
      passed: hasFormula || i === 0, // First test always passes for demo
      got: hasFormula ? tc.expected : String(Math.floor(Math.random() * 100)),
    }));

    const passed = results.filter((r) => r.passed).length;
    const calculatedScore = Math.round((passed / results.length) * 100);

    setTestResults(results);
    setScore(calculatedScore);
    setOutputStatus("submitted");
    setOutputText(
      `Submission complete: ${passed}/${results.length} test cases passed`,
    );

    const entry: HistoryEntry = {
      id: Date.now().toString(),
      language,
      code,
      timestamp: Date.now(),
      status: calculatedScore === 100 ? "passed" : "failed",
      score: calculatedScore,
    };
    setHistory((prev) => [entry, ...prev.slice(0, 19)]);

    if (calculatedScore === 100) {
      toast.success("🎉 All test cases passed! Perfect score!");
    } else {
      toast.error(`${passed}/${results.length} test cases passed`);
    }
  }, [code, language]);

  const handleDownload = useCallback(() => {
    const ext = LANG_EXTENSIONS[language];
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solution.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded solution.${ext}`);
  }, [code, language]);

  const handleShare = useCallback(() => {
    const encoded = btoa(encodeURIComponent(code));
    const url = `${window.location.origin}${window.location.pathname}#/code-editor?code=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Share link copied to clipboard!");
    });
  }, [code]);

  const handleHint = useCallback(() => {
    if (hintsUsed >= HINTS.length) {
      toast.info("No more hints available for this problem.");
      return;
    }
    toast.info(HINTS[hintsUsed], { duration: 8000 });
    setHintsUsed((prev) => prev + 1);
  }, [hintsUsed]);

  const sendAIMessage = useCallback(
    async (action: string, userMsg?: string) => {
      const userContent = userMsg || action;
      const newUserMsg: AIMessage = {
        id: Date.now().toString(),
        role: "user",
        content: userContent,
        timestamp: Date.now(),
      };
      setAIMessages((prev) => [...prev, newUserMsg]);
      setAITyping(true);
      setActiveRightTab("ai");

      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

      const response = generateAIResponse(action, code, aiMode, userMsg);
      const aiMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };
      setAIMessages((prev) => [...prev, aiMsg]);
      setAITyping(false);
    },
    [code, aiMode],
  );

  const handleAISend = useCallback(() => {
    if (!aiInput.trim()) return;
    const msg = aiInput.trim();
    setAIInput("");
    sendAIMessage("chat", msg);
  }, [aiInput, sendAIMessage]);

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const themeStyle = THEME_STYLES[theme];

  const formatTimer = (s: number) => {
    const remaining = timerDuration - s;
    const m = Math.floor(remaining / 60);
    const sec = remaining % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const AI_ACTIONS = [
    { key: "explain", label: "Explain", icon: "📖" },
    { key: "error", label: "Find Error", icon: "🔍" },
    { key: "optimize", label: "Optimize", icon: "⚡" },
    { key: "convert", label: "Convert", icon: "🔄" },
    { key: "testcases", label: "Test Cases", icon: "🧪" },
    { key: "complexity", label: "Complexity", icon: "📊" },
    { key: "comments", label: "Comments", icon: "💬" },
    { key: "dryrun", label: "Dry Run", icon: "🔎" },
  ];

  // Render AI message content with code blocks
  const renderAIContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      const partKey = `part-${i}`;
      if (part.startsWith("```")) {
        const lines = part.split("\n");
        const lang = lines[0].replace("```", "").trim();
        const codeContent = lines.slice(1, -1).join("\n");
        return (
          <div
            key={partKey}
            className="relative mt-2 mb-2 rounded-md overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#1e1e1e] border-b border-[#3e3e42]">
              <span className="text-[10px] text-[#858585] font-mono uppercase">
                {lang || "code"}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(codeContent);
                  toast.success("Code copied!");
                }}
                className="text-[#858585] hover:text-[#d4d4d4] transition-colors"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <pre className="p-3 text-xs font-mono overflow-x-auto bg-[#1e1e1e] text-[#d4d4d4] leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }
      // Render markdown-lite: bold, headers
      const formatted = part
        .replace(
          /## (.*)/g,
          '<h3 class="font-bold text-sm mt-2 mb-1 text-foreground">$1</h3>',
        )
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-foreground">$1</strong>',
        )
        .replace(
          /`([^`]+)`/g,
          '<code class="bg-muted/40 px-1 rounded text-xs font-mono text-primary">$1</code>',
        )
        .replace(/\n/g, "<br/>");
      return (
        <span
          key={partKey}
          className="text-xs leading-relaxed"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled content
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  const editorPanel = (
    <div className="flex flex-col h-full" style={{ background: themeStyle.bg }}>
      {/* Editor Toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b flex-wrap gap-y-1.5"
        style={{ background: themeStyle.panel, borderColor: themeStyle.border }}
      >
        {/* Language selector */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="text-xs font-mono rounded px-2 py-1.5 pr-6 border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{
              background: themeStyle.bg,
              color: themeStyle.text,
              borderColor: themeStyle.border,
            }}
          >
            {(Object.keys(LANG_LABELS) as Language[]).map((lang) => (
              <option key={lang} value={lang}>
                {LANG_LABELS[lang]}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
            style={{ color: themeStyle.text }}
          />
        </div>

        {/* Theme selector */}
        <div className="relative">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="text-xs font-mono rounded px-2 py-1.5 pr-6 border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{
              background: themeStyle.bg,
              color: themeStyle.text,
              borderColor: themeStyle.border,
            }}
          >
            {(Object.keys(THEME_STYLES) as Theme[]).map((t) => (
              <option key={t} value={t}>
                {THEME_STYLES[t].label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
            style={{ color: themeStyle.text }}
          />
        </div>

        <div className="flex-1" />

        {/* Hint */}
        <button
          type="button"
          onClick={handleHint}
          title={`Hint (${hintsUsed}/${HINTS.length} used)`}
          className="flex items-center gap-1 text-xs px-2 py-1.5 rounded border transition-colors hover:bg-yellow-500/20"
          style={{ color: "#fbbf24", borderColor: themeStyle.border }}
        >
          <Lightbulb className="w-3 h-3" />
          <span className="hidden sm:inline">Hint</span>
          <span className="text-[10px] opacity-60">
            {hintsUsed}/{HINTS.length}
          </span>
        </button>

        {/* Custom input toggle */}
        <button
          type="button"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="flex items-center gap-1 text-xs px-2 py-1.5 rounded border transition-colors"
          style={{
            color: showCustomInput ? "#569cd6" : themeStyle.text,
            borderColor: showCustomInput ? "#569cd6" : themeStyle.border,
            background: showCustomInput
              ? "rgba(86,156,214,0.1)"
              : "transparent",
          }}
        >
          <Terminal className="w-3 h-3" />
          <span className="hidden sm:inline">Input</span>
          {showCustomInput ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>

        {/* Download */}
        <button
          type="button"
          onClick={handleDownload}
          title="Download code"
          className="flex items-center gap-1 text-xs px-2 py-1.5 rounded border transition-colors hover:opacity-80"
          style={{ color: themeStyle.text, borderColor: themeStyle.border }}
        >
          <Download className="w-3 h-3" />
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          title="Share code"
          className="flex items-center gap-1 text-xs px-2 py-1.5 rounded border transition-colors hover:opacity-80"
          style={{ color: themeStyle.text, borderColor: themeStyle.border }}
        >
          <Share2 className="w-3 h-3" />
        </button>

        {/* Fullscreen */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title="Toggle fullscreen"
          className="flex items-center gap-1 text-xs px-2 py-1.5 rounded border transition-colors hover:opacity-80"
          style={{ color: themeStyle.text, borderColor: themeStyle.border }}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3 h-3" />
          ) : (
            <Maximize2 className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Custom Input */}
      <AnimatePresence>
        {showCustomInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-3 py-2 border-b"
              style={{
                background: themeStyle.panel,
                borderColor: themeStyle.border,
              }}
            >
              <p
                className="text-[10px] font-mono mb-1.5"
                style={{ color: "#858585" }}
              >
                STDIN / Custom Input
              </p>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom input here..."
                rows={3}
                className="w-full text-xs font-mono resize-none rounded px-2 py-1.5 border focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={{
                  background: themeStyle.bg,
                  color: themeStyle.text,
                  borderColor: themeStyle.border,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Editor (textarea) */}
      <div className="flex-1 overflow-hidden relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            // Tab key inserts 4 spaces
            if (e.key === "Tab") {
              e.preventDefault();
              const start = e.currentTarget.selectionStart;
              const end = e.currentTarget.selectionEnd;
              const newCode = `${code.substring(0, start)}    ${code.substring(end)}`;
              setCode(newCode);
              setTimeout(() => {
                e.currentTarget.selectionStart = start + 4;
                e.currentTarget.selectionEnd = start + 4;
              }, 0);
            }
          }}
          onSelect={(e) => {
            const el = e.currentTarget;
            const text = el.value.substring(0, el.selectionStart);
            const lines = text.split("\n");
            setCursorPos({
              line: lines.length,
              col: lines[lines.length - 1].length + 1,
            });
          }}
          spellCheck={false}
          className="w-full h-full resize-none outline-none font-mono text-[13px] leading-relaxed p-4 border-0"
          style={{
            background: themeStyle.bg,
            color: themeStyle.text,
            caretColor: themeStyle.text,
            tabSize: 4,
          }}
        />
      </div>

      {/* Action Buttons */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-t"
        style={{ background: themeStyle.panel, borderColor: themeStyle.border }}
      >
        <Button
          type="button"
          size="sm"
          onClick={handleRunCode}
          disabled={outputStatus === "running"}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-mono text-xs h-8 px-4"
        >
          {outputStatus === "running" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          Run Code
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={outputStatus === "running"}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs h-8 px-4"
        >
          <Send className="w-3.5 h-3.5" />
          Submit
        </Button>
        <button
          type="button"
          onClick={() => {
            setCode(STARTER_CODE[language]);
            setOutputStatus("idle");
            setOutputText("");
            setErrorLine(null);
          }}
          className="flex items-center gap-1 text-xs px-2 py-1.5 rounded border transition-colors hover:opacity-80"
          style={{ color: themeStyle.text, borderColor: themeStyle.border }}
          title="Reset code"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* VS Code-style Status Bar */}
      <div
        className="flex items-center justify-between px-3 py-0.5 font-mono text-[10px]"
        style={{
          background: themeStyle.statusBg,
          color: themeStyle.statusText,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Code2 className="w-2.5 h-2.5" />
            {LANG_LABELS[language]}
          </span>
          {execTime !== null && (
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {execTime}ms
            </span>
          )}
          {memoryMB !== null && <span>{memoryMB}MB</span>}
        </div>
        <div className="flex items-center gap-3">
          <span>
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span>{themeStyle.label}</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );

  const rightPanel = (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <Tabs
        value={activeRightTab}
        onValueChange={setActiveRightTab}
        className="flex flex-col h-full"
      >
        <TabsList className="mx-3 mt-3 mb-0 grid grid-cols-3 shrink-0 h-9">
          <TabsTrigger
            value="output"
            className="text-xs flex items-center gap-1.5"
          >
            <Terminal className="w-3 h-3" />
            Output
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs flex items-center gap-1.5">
            <Bot className="w-3 h-3" />
            AI
            {aiTyping && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            )}
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="text-xs flex items-center gap-1.5"
          >
            <History className="w-3 h-3" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Output Tab */}
        <TabsContent
          value="output"
          className="flex-1 overflow-hidden m-0 flex flex-col"
        >
          <div className="flex-1 overflow-hidden flex flex-col p-3 gap-3">
            {/* Status Banner */}
            {outputStatus !== "idle" && (
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono shrink-0",
                  outputStatus === "running" &&
                    "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                  outputStatus === "success" &&
                    "bg-green-500/10 text-green-400 border border-green-500/20",
                  outputStatus === "error" &&
                    "bg-red-500/10 text-red-400 border border-red-500/20",
                  outputStatus === "submitted" &&
                    "bg-purple-500/10 text-purple-400 border border-purple-500/20",
                )}
              >
                {outputStatus === "running" && (
                  <Loader2 className="w-3 h-3 animate-spin" />
                )}
                {outputStatus === "success" && (
                  <CheckCircle2 className="w-3 h-3" />
                )}
                {outputStatus === "error" && <XCircle className="w-3 h-3" />}
                {outputStatus === "submitted" && <Trophy className="w-3 h-3" />}
                <span>
                  {outputStatus === "running" && "Executing..."}
                  {outputStatus === "success" &&
                    `Executed successfully · ${execTime}ms · ${memoryMB}MB`}
                  {outputStatus === "error" &&
                    (errorLine
                      ? `Runtime error at line ${errorLine}`
                      : "Compilation error")}
                  {outputStatus === "submitted" && outputText}
                </span>
              </div>
            )}

            {/* Score (after submit) */}
            {score !== null && outputStatus === "submitted" && (
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={cn(
                    "flex-1 rounded-lg p-3 border",
                    score === 100
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-yellow-500/10 border-yellow-500/20",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">Score</span>
                    <span
                      className={cn(
                        "text-lg font-bold font-mono",
                        score === 100 ? "text-green-400" : "text-yellow-400",
                      )}
                    >
                      {score}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-1000",
                        score === 100 ? "bg-green-400" : "bg-yellow-400",
                      )}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Test Case Results */}
            {testResults.length > 0 && (
              <div className="space-y-1.5 shrink-0">
                <p className="text-xs text-muted-foreground font-mono">
                  Test Cases:
                </p>
                {testResults.map((tc) => (
                  <div
                    key={tc.id}
                    className={cn(
                      "flex items-start gap-2 px-2.5 py-2 rounded-md text-xs font-mono border",
                      tc.passed
                        ? "bg-green-500/8 border-green-500/20"
                        : "bg-red-500/8 border-red-500/20",
                    )}
                  >
                    {tc.passed ? (
                      <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <span
                        className={
                          tc.passed ? "text-green-400" : "text-red-400"
                        }
                      >
                        Test {tc.id}: {tc.passed ? "Passed" : "Failed"}
                      </span>
                      {!tc.passed && (
                        <div className="text-muted-foreground mt-0.5 text-[10px]">
                          Input: {tc.input} | Expected: {tc.expected} | Got:{" "}
                          {tc.got}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Output text */}
            <div className="flex-1 overflow-hidden rounded-lg border border-border bg-[#1e1e1e] min-h-0">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#3e3e42]">
                <span className="text-[10px] text-[#858585] font-mono uppercase">
                  Console Output
                </span>
                {outputText && (
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(outputText)}
                    className="text-[#858585] hover:text-[#d4d4d4] transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
              <ScrollArea className="h-full p-3">
                {outputStatus === "idle" && (
                  <p className="text-[#858585] text-xs font-mono">
                    {"// Run your code to see output here"}
                  </p>
                )}
                {outputStatus === "running" && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                    <span className="text-blue-400 text-xs font-mono">
                      Compiling and executing...
                    </span>
                  </div>
                )}
                {(outputStatus === "success" || outputStatus === "submitted") &&
                  outputText && (
                    <pre
                      className={cn(
                        "text-xs font-mono whitespace-pre-wrap leading-relaxed",
                        outputStatus === "success"
                          ? "text-[#d4d4d4]"
                          : "text-[#9cdcfe]",
                      )}
                    >
                      {outputText}
                    </pre>
                  )}
                {outputStatus === "error" && (
                  <pre className="text-[#f44747] text-xs font-mono whitespace-pre-wrap leading-relaxed">
                    {`Error: ${outputText}`}
                  </pre>
                )}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        {/* AI Tab */}
        <TabsContent
          value="ai"
          className="flex-1 overflow-hidden m-0 flex flex-col"
        >
          <div className="flex flex-col h-full">
            {/* AI Mode selector */}
            <div className="px-3 pt-2 pb-2 border-b border-border shrink-0">
              <div className="flex gap-1 flex-wrap">
                {(
                  ["beginner", "interview", "debug", "optimization"] as AIMode[]
                ).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setAIMode(m)}
                    className={cn(
                      "text-[10px] px-2 py-1 rounded-md capitalize font-medium transition-all border",
                      aiMode === m
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50",
                    )}
                  >
                    {m === "beginner"
                      ? "🎓"
                      : m === "interview"
                        ? "💼"
                        : m === "debug"
                          ? "🔍"
                          : "⚡"}{" "}
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-3 py-2 border-b border-border shrink-0">
              <div className="flex flex-wrap gap-1">
                {AI_ACTIONS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => sendAIMessage(a.key)}
                    disabled={aiTyping}
                    className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all disabled:opacity-50"
                  >
                    <span>{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat messages */}
            <div
              ref={aiScrollRef}
              className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0"
            >
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0",
                      msg.role === "user"
                        ? "gradient-brand text-white"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {msg.role === "user" ? "U" : "🤖"}
                  </div>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                      msg.role === "user"
                        ? "gradient-brand text-white rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm",
                    )}
                  >
                    {msg.role === "assistant"
                      ? renderAIContent(msg.content)
                      : msg.content}
                  </div>
                </div>
              ))}
              {aiTyping && (
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] shrink-0">
                    🤖
                  </div>
                  <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 flex gap-1 items-center">
                    <span
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* AI Input */}
            <div className="px-3 pb-3 pt-2 border-t border-border shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAIInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleAISend()
                  }
                  placeholder="Ask AI anything..."
                  disabled={aiTyping}
                  className="flex-1 text-xs bg-muted rounded-lg px-3 py-2 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleAISend}
                  disabled={!aiInput.trim() || aiTyping}
                  className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full p-3">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <History className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No submissions yet
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Run or submit code to see history
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-2 p-2.5 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors group"
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        entry.status === "passed" && "bg-green-400",
                        entry.status === "failed" && "bg-red-400",
                        entry.status === "practice" && "bg-blue-400",
                        entry.status === "error" && "bg-yellow-400",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 h-4 font-mono"
                        >
                          {LANG_LABELS[entry.language]}
                        </Badge>
                        <span
                          className={cn(
                            "text-[10px] font-medium capitalize",
                            entry.status === "passed" && "text-green-400",
                            entry.status === "failed" && "text-red-400",
                            entry.status === "practice" && "text-blue-400",
                            entry.status === "error" && "text-yellow-400",
                          )}
                        >
                          {entry.status}
                          {entry.score !== undefined && ` · ${entry.score}%`}
                        </span>
                        {entry.execTime && (
                          <span className="text-[10px] text-muted-foreground">
                            {entry.execTime}ms
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                        {formatTime(entry.timestamp)}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setCode(entry.code);
                          setLanguage(entry.language);
                        }}
                        className="text-[10px] text-primary hover:underline mt-0.5"
                      >
                        Load code
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteHistory(entry.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50 bg-background" : "h-full",
      )}
    >
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-card border-b border-border shrink-0 flex-wrap gap-y-1.5">
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center shadow-brand">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-sm">Code Editor</span>
        </div>

        {/* Practice mode selector */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {(["practice", "interview", "contest"] as PracticeMode[]).map(
            (mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setPracticeMode(mode);
                  setTimerSeconds(0);
                  setTimerRunning(false);
                }}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-md capitalize font-medium transition-all",
                  practiceMode === mode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {mode === "practice" ? "🔹" : mode === "interview" ? "⏱" : "🏆"}{" "}
                {mode}
              </button>
            ),
          )}
        </div>

        {/* Interview Timer */}
        {practiceMode === "interview" && (
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1.5">
            <Timer className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-mono text-sm font-bold text-orange-400">
              {formatTimer(timerSeconds)}
            </span>
            <button
              type="button"
              onClick={() => setTimerRunning(!timerRunning)}
              className="text-[10px] text-orange-400 hover:text-orange-300 border border-orange-400/40 rounded px-1.5 py-0.5"
            >
              {timerRunning ? "Pause" : "Start"}
            </button>
            <select
              value={timerDuration}
              onChange={(e) => {
                setTimerDuration(Number(e.target.value));
                setTimerSeconds(0);
                setTimerRunning(false);
              }}
              className="text-[10px] bg-transparent text-orange-400 border-none outline-none cursor-pointer"
            >
              <option value={15 * 60}>15 min</option>
              <option value={20 * 60}>20 min</option>
              <option value={30 * 60}>30 min</option>
              <option value={45 * 60}>45 min</option>
              <option value={60 * 60}>60 min</option>
            </select>
          </div>
        )}

        {/* Contest Leaderboard */}
        {practiceMode === "contest" && (
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">
              Contest Mode
            </span>
            <div className="flex gap-1.5">
              {LEADERBOARD.slice(0, 3).map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center gap-1"
                  title={`${entry.name}: ${entry.score}%`}
                >
                  <span className="text-xs">{entry.badge}</span>
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">
                    {entry.name.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                toast.info(
                  LEADERBOARD.map(
                    (e) => `${e.badge} ${e.name}: ${e.score}% (${e.time})`,
                  ).join("\n"),
                  { duration: 5000 },
                );
              }}
              className="text-[10px] text-yellow-400 hover:underline"
            >
              View All
            </button>
          </div>
        )}

        <div className="flex-1" />

        {/* Fullscreen toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-1.5 transition-colors"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Expand className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">
            {isFullscreen ? "Exit" : "Fullscreen"}
          </span>
        </button>
      </div>

      {/* Mobile Panel Toggle */}
      <div className="lg:hidden flex border-b border-border shrink-0">
        <button
          type="button"
          onClick={() => setMobilePanelView("editor")}
          className={cn(
            "flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
            mobilePanelView === "editor"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground",
          )}
        >
          <Code2 className="w-3.5 h-3.5" />
          Editor
        </button>
        <button
          type="button"
          onClick={() => setMobilePanelView("output")}
          className={cn(
            "flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
            mobilePanelView === "output"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground",
          )}
        >
          <Terminal className="w-3.5 h-3.5" />
          Output / AI
        </button>
      </div>

      {/* Main Split Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Desktop: side-by-side | Mobile: toggle */}
        <div
          className={cn(
            "flex-1 overflow-hidden",
            "lg:flex lg:flex-row",
            mobilePanelView === "editor" ? "flex flex-col" : "hidden",
            "lg:flex",
          )}
        >
          {/* Left: Editor */}
          <div
            className={cn(
              "overflow-hidden flex flex-col",
              "lg:w-[55%] lg:flex lg:flex-col",
              mobilePanelView === "editor" ? "flex-1" : "",
            )}
          >
            {editorPanel}
          </div>

          {/* Right: Output/AI/History */}
          <div className="hidden lg:flex lg:flex-col lg:flex-1 overflow-hidden">
            {rightPanel}
          </div>
        </div>

        {/* Mobile output panel */}
        {mobilePanelView === "output" && (
          <div className="flex-1 overflow-hidden lg:hidden">{rightPanel}</div>
        )}
      </div>

      {/* Fullscreen exit button */}
      {isFullscreen && (
        <button
          type="button"
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-50 w-8 h-8 rounded-full bg-card border border-border shadow-card-md flex items-center justify-center hover:bg-accent transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
