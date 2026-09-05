import tkinter as tk
from tkinter import messagebox
import os

class Calculator:
    def __init__(self, root):
        self.root = root
        self.root.title("Calculator")
        self.root.geometry("350x500")
        self.root.resizable(False, False)

        self.display = tk.Entry(root, width=22, font=("Arial", 28), borderwidth=5, relief="ridge", justify="right")
        self.display.grid(row=0, column=0, columnspan=4, padx=10, pady=10)

        buttons = [
            ('7', 1, 0), ('8', 1, 1), ('9', 1, 2), ('/', 1, 3),
            ('4', 2, 0), ('5', 2, 1), ('6', 2, 2), ('*', 2, 3),
            ('1', 3, 0), ('2', 3, 1), ('3', 3, 2), ('-', 3, 3),
            ('0', 4, 0), ('.', 4, 1), ('=', 4, 2), ('+', 4, 3),
            ('C', 5, 0, 2), ('⌫', 5, 2, 1),
        ]

        for btn_data in buttons:
            text = btn_data[0]
            row = btn_data[1]
            col = btn_data[2]
            colspan = btn_data[3] if len(btn_data) > 3 else 1

            if text in ('/', '*', '-', '+'):
                btn = tk.Button(root, text=text, width=5, height=2, font=("Arial", 20), command=lambda t=text: self.button_click(t), bg="#FF9800", fg="white")
            elif text == '=':
                btn = tk.Button(root, text=text, width=5, height=2, font=("Arial", 20), command=self.calculate, bg="#4CAF50", fg="white")
            elif text == 'C':
                btn = tk.Button(root, text=text, width=11, height=2, font=("Arial", 20), command=self.clear, bg="#f44336", fg="white")
            elif text == '⌫':
                btn = tk.Button(root, text=text, width=5, height=2, font=("Arial", 20), command=self.backspace, bg="#607D8B", fg="white")
            else:
                btn = tk.Button(root, text=text, width=5, height=2, font=("Arial", 20), command=lambda t=text: self.button_click(t))
            
            btn.grid(row=row, column=col, columnspan=colspan, padx=5, pady=5, sticky="nsew")

        for i in range(4):
            root.grid_columnconfigure(i, weight=1)
        for i in range(1, 6):
            root.grid_rowconfigure(i, weight=1)

    def button_click(self, value):
        current = self.display.get()
        self.display.delete(0, tk.END)
        self.display.insert(0, current + value)

    def clear(self):
        self.display.delete(0, tk.END)

    def backspace(self):
        current = self.display.get()
        self.display.delete(0, tk.END)
        self.display.insert(0, current[:-1])

    def calculate(self):
        expression = self.display.get()
        
        if expression == "2+2":
            video_path = r"C:\Users\mgama\Desktop\html\test\2+2.mp4"
            
            if os.path.exists(video_path):
                try:
                    os.startfile(video_path)
                except Exception:
                    messagebox.showerror("Error", "Could not play video")
            else:
                messagebox.showerror("Error", "Video file not found")
            
            self.display.delete(0, tk.END)
            self.display.insert(0, "Playing video...")
            return
        
        try:
            if not expression:
                return
            result = eval(expression)
            self.display.delete(0, tk.END)
            self.display.insert(0, str(result))
        except ZeroDivisionError:
            messagebox.showerror("Error", "Cannot divide by zero")
            self.clear()
        except Exception:
            messagebox.showerror("Error", "Invalid expression")
            self.clear()

if __name__ == "__main__":
    root = tk.Tk()
    app = Calculator(root)
    root.mainloop()