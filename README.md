# WebLLM

A web application that provides an interface to interact with Meta's Llama 2 models using the Llama API.

## Features

- Modern, responsive UI built with Tailwind CSS
- Support for multiple Llama 2 models
- Real-time model switching
- Loading states and error handling
- Keyboard shortcuts for better UX

## Prerequisites

- Python 3.8 or higher
- A Llama API token

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd webllm
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory and add your Llama API token:
```
LLAMA_TOKEN=your_token_here
```

## Running the Application

1. Start the Flask development server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

## Available Models

The application currently supports the following Llama 2 models:
- Llama 2 7B Chat (7 billion parameters)
- Llama 2 13B Chat (13 billion parameters)
- Llama 2 70B Chat (70 billion parameters)

All models are:
- Optimized for chat interactions
- Open source
- Developed by Meta
- Accessible through the Llama API

## Usage

1. Select a model from the dropdown menu
2. Enter your prompt in the text area
3. Click "Generate Response" or press Enter
4. Wait for the model to generate a response
5. View the generated text in the response section

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.