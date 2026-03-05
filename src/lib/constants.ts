export interface Language {
    id: number;        // Judge0 language ID
    name: string;
    monacoId: string;  // Monaco editor language identifier
    defaultCode: string;
}

export const LANGUAGES: Language[] = [
    {
        id: 63,
        name: "JavaScript",
        monacoId: "javascript",
        defaultCode: `// Welcome to CodeHub! 🚀
// Start coding in JavaScript

function greet(name) {
  return \`Hello, \${name}! Welcome to CodeHub.\`;
}

console.log(greet("World"));
`,
    },
    {
        id: 74,
        name: "TypeScript",
        monacoId: "typescript",
        defaultCode: `// TypeScript - Strongly typed JavaScript
function greet(name: string): string {
  return \`Hello, \${name}! Welcome to CodeHub.\`;
}

console.log(greet("World"));
`,
    },
    {
        id: 71,
        name: "Python",
        monacoId: "python",
        defaultCode: `# Python - Simple and powerful
def greet(name: str) -> str:
    return f"Hello, {name}! Welcome to CodeHub."

print(greet("World"))
`,
    },
    {
        id: 54,
        name: "C++",
        monacoId: "cpp",
        defaultCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "World";
    cout << "Hello, " << name << "! Welcome to CodeHub." << endl;
    return 0;
}
`,
    },
    {
        id: 62,
        name: "Java",
        monacoId: "java",
        defaultCode: `public class Main {
    public static void main(String[] args) {
        String name = "World";
        System.out.println("Hello, " + name + "! Welcome to CodeHub.");
    }
}
`,
    },
    {
        id: 50,
        name: "C",
        monacoId: "c",
        defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, World! Welcome to CodeHub.\\n");
    return 0;
}
`,
    },
    {
        id: 60,
        name: "Go",
        monacoId: "go",
        defaultCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World! Welcome to CodeHub.")
}
`,
    },
    {
        id: 73,
        name: "Rust",
        monacoId: "rust",
        defaultCode: `fn main() {
    let name = "World";
    println!("Hello, {}! Welcome to CodeHub.", name);
}
`,
    },
    {
        id: 72,
        name: "Ruby",
        monacoId: "ruby",
        defaultCode: `# Ruby - Elegant and expressive
def greet(name)
  "Hello, #{name}! Welcome to CodeHub."
end

puts greet("World")
`,
    },
    {
        id: 68,
        name: "PHP",
        monacoId: "php",
        defaultCode: `<?php
function greet($name) {
    return "Hello, $name! Welcome to CodeHub.";
}

echo greet("World") . "\\n";
?>
`,
    },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0]; // JavaScript
