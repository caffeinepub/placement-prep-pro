import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Check, Copy, GraduationCap, Send, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

// ── AI Response Generator ──────────────────────────────────────────────────
function generateAIResponse(message: string): string {
  const m = message.toLowerCase();

  // C Pointers
  if (m.includes("pointer") && (m.includes("c") || m.includes("c++"))) {
    return `A **pointer** in C is a variable that stores the memory address of another variable. It's one of the most powerful — and tricky — features of C.

**Basic pointer syntax:**
\`\`\`c
int x = 10;
int *ptr = &x;   // ptr holds address of x

printf("%d", *ptr);  // dereference: prints 10
printf("%p", ptr);   // prints memory address
\`\`\`

**Key rules to remember:**
- \`&\` = "address of" operator
- \`*\` = dereference (get the value at address)
- Pointer arithmetic: \`ptr++\` moves to next int-sized block

**Common use cases:** passing large structs to functions, dynamic memory allocation (\`malloc\`/\`free\`), and arrays (array name is already a pointer to first element).

Practice: Write a function that swaps two integers using pointers — this is a classic interview question! 🎯`;
  }

  // C Arrays
  if (
    (m.includes("array") || m.includes("string")) &&
    (m.includes(" c ") || m.includes("c lang") || m.includes("in c"))
  ) {
    return `Arrays in C are contiguous blocks of memory. Here's what you need to know:

\`\`\`c
// Declaration & initialization
int marks[5] = {85, 90, 78, 92, 88};
char name[20] = "Placement Prep";

// Accessing elements (0-indexed)
printf("%d", marks[2]);   // 78
printf("%c", name[0]);    // P

// Iterating
for (int i = 0; i < 5; i++) {
    printf("%d ", marks[i]);
}
\`\`\`

**Strings in C** are character arrays ending with \`\0\` (null character). Use \`<string.h>\` for functions like \`strlen()\`, \`strcpy()\`, \`strcmp()\`, \`strcat()\`.

**Key tip for interviews:** Array name = pointer to first element. \`marks\` is the same as \`&marks[0]\`. This is why arrays are passed by reference to functions. 💡`;
  }

  // Recursion
  if (m.includes("recursion") || m.includes("recursive")) {
    return `**Recursion** is when a function calls itself to solve a smaller version of the same problem. Every recursive function needs:
1. **Base case** — condition to stop recursing
2. **Recursive case** — the self-call that moves toward base case

\`\`\`python
# Classic example: Factorial
def factorial(n):
    if n == 0 or n == 1:   # Base case
        return 1
    return n * factorial(n - 1)  # Recursive case

print(factorial(5))  # 5 * 4 * 3 * 2 * 1 = 120

# Fibonacci
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
\`\`\`

**Mental model:** Draw the call stack. Each call waits for its sub-call to return. 

**Interview tip:** Recursion → think Tree (decision tree of all calls). When you see "all combinations", "all paths", or "subsets" in a problem — it's usually recursion/backtracking! 🌲`;
  }

  // Bubble Sort
  if (
    m.includes("bubble sort") ||
    (m.includes("bubble") && m.includes("sort"))
  ) {
    return `**Bubble Sort** compares adjacent elements and swaps them if out of order. Each pass "bubbles" the largest element to the end.

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:  # Optimization: already sorted
            break
    return arr

nums = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(nums))  # [11, 12, 22, 25, 34, 64, 90]
\`\`\`

**Complexity:**
- Time: O(n²) average & worst, O(n) best (already sorted with optimization)
- Space: O(1) — in-place sorting

**Interview insight:** Bubble sort is rarely used in practice due to O(n²) complexity, but interviewers love asking about it to test your understanding of sorting fundamentals. Mention that QuickSort (O(n log n) avg) or MergeSort are better choices in real scenarios. 🎯`;
  }

  // Python
  if (m.includes("python")) {
    return `Python is a must-know for placements, especially in AIML and Data roles! Here's a quick power tour:

\`\`\`python
# List Comprehensions (interview favorite!)
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# Lambda + Map + Filter
double = lambda x: x * 2
result = list(map(double, [1,2,3,4]))  # [2,4,6,8]

# Dictionary operations
student = {"name": "Ravi", "score": 95}
student["college"] = "NIT"  # Add key
score = student.get("score", 0)  # Safe access

# Error handling
try:
    x = int(input("Enter number: "))
except ValueError as e:
    print(f"Invalid input: {e}")
finally:
    print("Always runs")
\`\`\`

**Top Python interview topics:**
- List vs Tuple vs Set vs Dict differences
- Generators and \`yield\`
- Decorators
- \`*args\` and \`**kwargs\`
- File handling with \`with open()\`

Start with HackerRank Python track — it covers 90% of what placement tests ask! 🐍`;
  }

  // Java / OOP
  if (
    m.includes("java") ||
    m.includes("oop") ||
    m.includes("object oriented")
  ) {
    return `Java OOP is the backbone of most placement technical rounds. The 4 pillars:

\`\`\`java
// 1. ENCAPSULATION — hide data
public class Student {
    private String name;
    private int marks;
    
    public String getName() { return name; }
    public void setName(String n) { this.name = n; }
}

// 2. INHERITANCE
public class EngineeringStudent extends Student {
    private String branch;
    
    @Override
    public String toString() {
        return getName() + " - " + branch;
    }
}

// 3. POLYMORPHISM
Animal cat = new Cat();  // Runtime polymorphism
cat.speak();  // Calls Cat's speak(), not Animal's

// 4. ABSTRACTION
interface Drawable {
    void draw();  // Must be implemented
}
\`\`\`

**Common interview questions:**
- Abstract class vs Interface (can have constructors, multiple inheritance)
- \`final\`, \`static\`, \`this\` vs \`super\` keywords
- Method overloading vs overriding
- Java Collections: ArrayList vs LinkedList, HashMap vs TreeMap

Master these and you'll clear TCS, Infosys, Wipro technical rounds! ☕`;
  }

  // DSA
  if (
    m.includes("dsa") ||
    m.includes("data structure") ||
    m.includes("algorithm")
  ) {
    return `DSA is the MOST important topic for placements. Here's your priority order:

**🔴 Must-Do Topics (for all companies):**
1. Arrays & Strings — sliding window, two pointers
2. Recursion → Backtracking
3. Sorting (merge, quick) + Searching (binary search)
4. Hashing (HashMap problems)
5. Linked Lists (reverse, detect cycle)

\`\`\`python
# Binary Search — O(log n) searching
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Two Pointer — find pair with given sum
def two_sum_sorted(arr, target):
    l, r = 0, len(arr) - 1
    while l < r:
        s = arr[l] + arr[r]
        if s == target: return [l, r]
        elif s < target: l += 1
        else: r -= 1
\`\`\`

**🎯 Study plan:** LeetCode Easy (50) → Medium (30) → Hard (10). Focus on NeetCode 150 list — it covers every pattern you'll see in interviews! 📊`;
  }

  // Linked List
  if (m.includes("linked list")) {
    return `Linked Lists are a DSA staple in interviews. A singly linked list:

\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = new_node
    
    # REVERSE — most common interview question!
    def reverse(self):
        prev = None
        curr = self.head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        self.head = prev
\`\`\`

**Top Interview Problems:**
- Reverse a linked list (iterative + recursive)
- Detect cycle (Floyd's tortoise & hare — two pointers)
- Find middle node (slow/fast pointer)
- Merge two sorted lists
- Remove nth node from end

The fast/slow pointer technique solves 5+ linked list problems — master it! 🏃`;
  }

  // SQL
  if (m.includes("sql") || m.includes("database") || m.includes("query")) {
    return `SQL is tested in almost every company placement exam. Here are the high-priority topics:

\`\`\`sql
-- Basic SELECT
SELECT name, score FROM students WHERE score > 80 ORDER BY score DESC;

-- JOINs (most important!)
SELECT s.name, d.dept_name 
FROM students s
INNER JOIN departments d ON s.dept_id = d.id;

-- GROUP BY + Aggregate functions
SELECT dept_id, AVG(score) as avg_score, COUNT(*) as count
FROM students
GROUP BY dept_id
HAVING AVG(score) > 75;

-- Subquery
SELECT name FROM students
WHERE score > (SELECT AVG(score) FROM students);

-- Window functions (advanced)
SELECT name, score,
    RANK() OVER (ORDER BY score DESC) as rank_num
FROM students;
\`\`\`

**Must-practice queries for Oracle SQL:**
- Find 2nd highest salary (classic!)
- Delete duplicate rows
- Find employees earning more than their manager
- Consecutive seat IDs problem

Practice on HackerRank SQL track — all company-level questions are there! 🗄️`;
  }

  // Resume tips
  if (m.includes("resume") || m.includes("cv") || m.includes("ats")) {
    return `Here's how to write a placement-ready resume that clears ATS filters:

**✅ ATS-Friendly Checklist:**
- Use standard section headers: Education, Skills, Projects, Experience
- No tables, columns, graphics (ATS can't parse them)
- Use keywords from job description
- Save as PDF (unless specified otherwise)
- Keep to 1 page for fresher

**📝 Project bullet point formula:**
> [Action Verb] + [What you built] + [Tech used] + [Impact/result]

Example:
- ❌ "Made a website using React"  
- ✅ "Developed a full-stack student portal using React + Node.js, reducing manual data entry by 60%"

**🔥 Strong action verbs:** Developed, Implemented, Designed, Optimized, Automated, Built, Led, Reduced, Increased

**Skills section for freshers:**
\`\`\`
Languages: C, C++, Python, Java
Web: HTML, CSS, JavaScript, React
Database: MySQL, Oracle SQL
Tools: Git, GitHub, VS Code
\`\`\`

Run your resume through Resumeworded.com (free ATS score) before applying! 📄`;
  }

  // Interview tips
  if (
    m.includes("interview") ||
    m.includes("hr question") ||
    m.includes("tell me about yourself")
  ) {
    return `Here's how to nail your placement interviews:

**🎤 "Tell me about yourself" — STAR formula:**
> "I'm [Name], a [year] year [branch] student at [College]. I have strong skills in [2-3 skills]. I've built [1-2 projects], including [brief project description]. I'm seeking a [role] role where I can [contribute value]."

**💡 Common HR Questions & Smart Answers:**

1. **Strengths?** → Pick a real strength + evidence: "Problem solving — I solved X challenge in Y project"
2. **Weakness?** → Real weakness + how you're improving it: "Public speaking — I joined [club] to practice"
3. **Why this company?** → Research + align with values: "TCS's digital transformation focus aligns with my full-stack background"
4. **Where in 5 years?** → "Growing in [domain], taking on leadership roles, contributing to larger projects"

**📋 Technical Interview Checklist:**
- Review your resume thoroughly — they WILL ask about every project
- Know time & space complexity of your solutions
- Practice explaining your thought process out loud
- Always ask clarifying questions before coding

**🚀 Final tip:** Practice mock interviews on Pramp.com (free, peer-to-peer). Saying your answers out loud 3 times makes a huge difference! 🎯`;
  }

  // TCS specific
  if (m.includes("tcs") || m.includes("tata consultancy")) {
    return `**TCS NQT (National Qualifier Test) Prep Guide:**

**📊 Exam Pattern:**
- Verbal Ability (24 questions, 30 min)
- Reasoning Ability (30 questions, 50 min)  
- Numerical Ability (26 questions, 40 min)
- Programming Logic (10 questions, 15 min)
- Coding (2 questions, 45 min)

**🎯 Section-wise Strategy:**

**Verbal:** Focus on reading comprehension, sentence correction, fill in the blanks. Practice 20 questions daily on IndiaBix.

**Reasoning:** Number series, blood relations, directions, coding-decoding. These are pattern-based — practice makes perfect.

**Numerical:** Percentage, time-work, probability, profit-loss. Use shortcut formulas for speed.

**Coding Section (Easy-Medium):**
\`\`\`python
# Typical TCS coding problem: 
# Print pattern, string manipulation, basic math
# Example: Check if number is Armstrong
def is_armstrong(n):
    digits = str(n)
    power = len(digits)
    return n == sum(int(d)**power for d in digits)
\`\`\`

**📚 Resources:** TCS NQT Previous Year Papers (GitHub), IndiaBix for aptitude, HackerRank for coding.

Cut-off is typically 40-50%. Focus on accuracy over speed! 🏆`;
  }

  // Infosys
  if (m.includes("infosys")) {
    return `**Infosys Placement Prep:**

**📊 Infosys InfyTQ / Hiring Process:**
1. Online Test: Reasoning + Verbal + Quantitative
2. Technical Interview (Java, OOP, DSA, DBMS)
3. HR Interview

**🎯 Key Focus Areas:**

**Technical Round Topics:**
- Java OOP concepts (mandatory — Infosys is Java-heavy)
- Basic DSA (arrays, linked list, sorting)
- DBMS: SQL queries, normalization, keys
- OS: process, thread, deadlock concepts
- Computer Networks: OSI model, TCP/IP

**Sample Technical Questions:**
\`\`\`java
// Infosys loves asking: Difference between ArrayList and LinkedList
// ArrayList: O(1) access, O(n) insert/delete
// LinkedList: O(n) access, O(1) insert/delete at known position

ArrayList<String> list = new ArrayList<>();
list.add("Placement");
list.get(0);  // O(1)

LinkedList<String> ll = new LinkedList<>();
ll.addFirst("Prep");  // O(1)
\`\`\`

**InfyTQ Certification:** Complete the Infosys campus certification — students with InfyTQ certification get preference and sometimes skip online rounds!

Register at infytq.infosys.com and complete Python + Java tracks. 🎓`;
  }

  // Google / Amazon (FAANG)
  if (
    m.includes("google") ||
    m.includes("amazon") ||
    m.includes("faang") ||
    m.includes("maang")
  ) {
    return `**Google / Amazon Placement Prep (Serious Mode Activated 🚀):**

These companies require a significantly higher preparation level. Here's the honest roadmap:

**📈 Required Skill Level:**
- LeetCode: 150+ problems (Easy + Medium mandatory, Hard desirable)
- Strong grasp of all DSA topics
- System Design basics (for SDE-II+, sometimes asked in internships)
- Behavioral interviews (STAR method)

**🎯 Coding Interview Pattern:**
\`\`\`python
# Amazon loves: Two pointers, Sliding window, BFS/DFS
# "Two Sum" — the most common Amazon question
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

# Google loves: Dynamic Programming, Graphs
# Longest Common Subsequence (DP)
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
\`\`\`

**📚 Resources:** NeetCode 150, Blind 75, "Cracking the Coding Interview" book.

**Timeline:** Start 6 months before placement season. 2-3 LeetCode problems daily minimum. You've got this! 💪`;
  }

  // OOP concepts
  if (m.includes("oop") || (m.includes("object") && m.includes("oriented"))) {
    return `**OOP (Object-Oriented Programming) — The 4 Pillars:**

\`\`\`python
# 1. ENCAPSULATION — Bundle data + methods, restrict direct access
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # Private attribute
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
    
    def get_balance(self):
        return self.__balance

# 2. INHERITANCE — Reuse parent class properties
class SavingsAccount(BankAccount):
    def __init__(self, balance, interest_rate):
        super().__init__(balance)
        self.interest_rate = interest_rate

# 3. POLYMORPHISM — Same interface, different behavior
class Animal:
    def speak(self): return "..."

class Dog(Animal):
    def speak(self): return "Woof!"  # Overriding

class Cat(Animal):
    def speak(self): return "Meow!"

# 4. ABSTRACTION — Hide complexity, expose only essentials
from abc import ABC, abstractmethod
class Shape(ABC):
    @abstractmethod
    def area(self): pass  # Must implement in subclass
\`\`\`

**Interview tip:** Always explain WITH examples. For polymorphism, the classic example is animal sounds. For abstraction, use a TV remote — you press a button without knowing the internal circuit! 📺`;
  }

  // Project ideas
  if (m.includes("project") && m.includes("idea")) {
    return `Here are placement-ready project ideas by difficulty:

**🟢 Beginner (1st year — start here):**
1. **Student Grade Calculator** — C/Python, file storage, GPA calculation
2. **Contact Book CLI** — Python, CSV/JSON, CRUD operations
3. **Simple Calculator** — Any language, covers functions + UI logic
4. **To-Do List App** — HTML+CSS+JS, localStorage

**🟡 Intermediate (Great for resume):**
1. **Student Management System** — Java OOP + MySQL, full CRUD
2. **Weather App** — JavaScript + OpenWeather API, async/await
3. **Portfolio Website** — HTML+CSS+JS, deployed on GitHub Pages
4. **Library Management** — Python + SQLite, demonstrates DSA + DB

**🔴 Advanced (Stand out!):**
1. **Chat Application** — React + Node.js + WebSockets
2. **Stock Price Predictor** — Python + ML (Linear Regression)
3. **E-Commerce Store** — Full stack with React + Express + MongoDB
4. **Campus Placement Tracker** — Perfect relevance to your career!

**💡 Golden rule:** A working project with 3 features beats an unfinished complex project. Deploy EVERYTHING on GitHub Pages or Vercel! 🚀`;
  }

  // Mock interview tips
  if (
    m.includes("mock interview") ||
    m.includes("interview tip") ||
    m.includes("prepare for interview")
  ) {
    return `**Mock Interview Master Guide 🎤**

**Before the Interview:**
- Research the company (products, recent news, tech stack)
- Review your resume — be ready to explain every line
- Solve 2-3 LeetCode problems the day before (warm up, not stress)
- Prepare 2-3 questions to ask the interviewer

**During Technical Round:**
1. **Read the problem out loud** — confirms understanding
2. **Clarify edge cases** — "What if input is empty? Negative numbers?"
3. **Think aloud** — "I'm thinking of using a hashmap here because..."
4. **Start with brute force** then optimize — shows thinking process
5. **Test your code** with the example, then edge cases

**During HR Round:**
- Maintain eye contact (even in video calls — look at camera)
- Structure answers with STAR: **S**ituation, **T**ask, **A**ction, **R**esult
- Show enthusiasm — interviewers hire people, not robots

**Body Language:**
- Smile genuinely when introduced
- Don't rush — take 5 seconds to think before answering
- "That's a great question, let me think..." is perfectly fine

**🆓 Free Mock Interview Platforms:**
- **Pramp** — peer-to-peer, free, real interviewers
- **Interviewing.io** — with engineers from top companies
- **LeetCode** — virtual contest mode

Practice 3 mock interviews before your first real one! 🏆`;
  }

  // DSA / What is DSA
  if (
    m.includes("what is dsa") ||
    (m.includes("dsa") && (m.includes("mean") || m.includes("what")))
  ) {
    return `**DSA = Data Structures + Algorithms** 🏗️

**Data Structures** are ways to organize and store data in memory:
- **Arrays** — sequential, fixed size, fast access O(1)
- **Linked Lists** — dynamic size, nodes with pointers
- **Stack** — LIFO (Last In, First Out) — undo functionality
- **Queue** — FIFO (First In, First Out) — printer queue
- **Trees** — hierarchical, BST for sorted search O(log n)
- **Graphs** — network of nodes, social media connections
- **Hash Tables** — key-value pairs, O(1) average lookup

**Algorithms** are step-by-step instructions to solve problems:
- **Sorting:** Bubble, Merge, Quick, Heap
- **Searching:** Linear, Binary
- **Graph:** BFS, DFS, Dijkstra's
- **Dynamic Programming:** memoization, tabulation

**Why DSA matters for placements:**
Every top company (Google, Amazon, Microsoft, even TCS & Infosys) tests DSA in their technical rounds. It's the universal language of coding interviews.

**Where to start:** Arrays → Strings → Recursion → Sorting → Trees → Graphs → DP. This order is optimal! Start with LeetCode Easy problems. 💪`;
  }

  // Greeting / general placement
  return `Hi! I'm your AI Placement Assistant. I'm here to help you crack placements! 🎯

Here's what I can help you with:

**💻 Technical Topics:**
- C, C++, Python, Java programming
- Data Structures & Algorithms
- DBMS (SQL queries, normalization)
- Computer Science fundamentals

**🚀 Placement Prep:**
- Company-specific prep (TCS, Infosys, Wipro, Google, Amazon)
- Resume writing & ATS optimization
- Mock interview tips & strategies
- Project ideas for your resume

**📚 Concept Explanations:**
- OOP principles with examples
- DSA patterns & code implementations
- Debugging help for your code

Try asking me things like:
- *"Explain C pointers with code"*
- *"How to prepare for TCS NQT?"*
- *"Write bubble sort in Python"*
- *"What is recursion?"*
- *"Resume tips for freshers"*

What would you like to learn today? 😊`;
}

// ── Code Block Renderer ───────────────────────────────────────────────────
function MessageContent({ content }: { content: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Parse content into text/code segments
  const segments: { type: "text" | "code"; content: string; lang?: string }[] =
    [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let codeIdx = 0;

  // biome-ignore lint/suspicious/noAssignInExpressions: regex exec pattern
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: "code",
      content: match[2].trim(),
      lang: match[1] || "code",
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    segments.push({ type: "text", content: content.slice(lastIndex) });
  }

  return (
    <div className="space-y-2">
      {segments.map((seg, i) => {
        if (seg.type === "code") {
          const idx = codeIdx++;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static parsed segments
              key={i}
              className="relative rounded-xl overflow-hidden border border-zinc-700/60 shadow-lg"
            >
              {/* Code header */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800 border-b border-zinc-700/60">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  {seg.lang || "code"}
                </span>
                <button
                  type="button"
                  onClick={() => copyCode(seg.content, idx)}
                  className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-zinc-900 px-4 py-3 overflow-x-auto text-xs leading-relaxed">
                <code className="text-green-400 font-mono whitespace-pre">
                  {seg.content}
                </code>
              </pre>
            </div>
          );
        }

        // Render text with basic markdown
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static parsed segments
            key={i}
            className="text-sm leading-relaxed space-y-1.5"
          >
            {seg.content.split("\n").map((line, li) => {
              if (!line.trim())
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: line index
                    key={li}
                    className="h-1"
                  />
                );

              // Bold text
              const boldLine = line.split(/\*\*(.*?)\*\*/g).map((part, pi) =>
                pi % 2 === 1 ? (
                  <strong
                    // biome-ignore lint/suspicious/noArrayIndexKey: inline parts
                    key={pi}
                    className="font-semibold"
                  >
                    {part}
                  </strong>
                ) : (
                  part
                ),
              );

              // Bullet points
              if (line.startsWith("- ") || line.startsWith("• ")) {
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: line index
                    key={li}
                    className="flex items-start gap-2 ml-2"
                  >
                    <span className="text-primary mt-1 text-xs shrink-0">
                      •
                    </span>
                    <span>{boldLine}</span>
                  </div>
                );
              }

              // Numbered items
              if (/^\d+\./.test(line)) {
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: line index
                    key={li}
                    className="flex items-start gap-2 ml-2"
                  >
                    <span>{boldLine}</span>
                  </div>
                );
              }

              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: line index
                  key={li}
                >
                  {boldLine}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Suggested Prompts ─────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  "Explain C pointers",
  "What is recursion?",
  "How to prepare for TCS?",
  "Write a bubble sort in Python",
  "Tips for resume writing",
  "Explain OOP concepts",
  "What is DSA?",
  "Mock interview tips",
];

// ── Main Component ────────────────────────────────────────────────────────
export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem("ai-chat-history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Persist chat history
  useEffect(() => {
    const trimmed = messages.slice(-100);
    localStorage.setItem("ai-chat-history", JSON.stringify(trimmed));
  }, [messages]);

  // Auto-scroll — biome-ignore: intentional trigger on messages + isThinking
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll triggers on data changes, not refs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    // Simulate AI "thinking" delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const aiResponse = generateAIResponse(trimmed);
    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      role: "ai",
      content: aiResponse,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsThinking(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("ai-chat-history");
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base leading-tight">
              AI Placement Assistant
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
              Always ready to help
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-muted-foreground hover:text-destructive gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear chat</span>
          </Button>
        )}
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {/* Empty state */}
        {messages.length === 0 && !isThinking && (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-brand">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">
                Your AI Placement Mentor
              </h2>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                Ask me anything about placements, coding, DSA, resume writing,
                or company-specific prep!
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mt-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all bg-card text-muted-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                msg.role === "user"
                  ? "gradient-brand shadow-brand"
                  : "bg-muted border border-border"
              }`}
            >
              {msg.role === "user" ? (
                <span className="text-white text-[10px] font-bold">YOU</span>
              ) : (
                <Bot className="w-3.5 h-3.5 text-foreground" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === "user"
                  ? "gradient-brand text-white rounded-tr-sm"
                  : "bg-card border border-border/60 rounded-tl-sm"
              }`}
            >
              {msg.role === "user" ? (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              ) : (
                <MessageContent content={msg.content} />
              )}
              <p
                className={`text-[10px] mt-1.5 ${
                  msg.role === "user"
                    ? "text-white/60 text-right"
                    : "text-muted-foreground"
                }`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="bg-card border border-border/60 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts (always shown, condensed when has messages) */}
      {messages.length > 0 && (
        <div className="px-4 pb-1 shrink-0">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTED_PROMPTS.slice(0, 5).map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={isThinking}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all bg-card text-muted-foreground whitespace-nowrap shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 border-t border-border/60 bg-card shrink-0">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about C programming, DSA, resume tips, TCS prep..."
            rows={1}
            className="min-h-[44px] max-h-[120px] resize-none flex-1 bg-background text-sm"
            disabled={isThinking}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isThinking}
            size="icon"
            className="h-11 w-11 gradient-brand text-white border-0 shadow-brand shrink-0"
          >
            {isThinking ? (
              <X className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-muted-foreground py-2 border-t border-border/40 shrink-0">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
