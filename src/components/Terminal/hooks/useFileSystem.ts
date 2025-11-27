import { useState } from 'react';

type FileSystemNode = {
    type: 'file' | 'directory';
    content?: string;
    children?: { [key: string]: FileSystemNode };
};

const initialFileSystem: FileSystemNode = {
    type: 'directory',
    children: {
        home: {
            type: 'directory',
            children: {
                guest: {
                    type: 'directory',
                    children: {
                        'readme.txt': {
                            type: 'file',
                            content: 'Welcome to the interactive terminal! Try commands like ls, cd, cat, mkdir, etc.'
                        },
                        projects: {
                            type: 'directory',
                            children: {
                                'eratosthenes.js': {
                                    type: 'file',
                                    content: '// Run "eratosthenes" to execute this algorithm'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const useFileSystem = () => {
    const [fs, setFs] = useState<FileSystemNode>(initialFileSystem);
    const [currentPath, setCurrentPath] = useState<string[]>(['home', 'guest']);

    const resolvePath = (path: string[]): FileSystemNode | null => {
        let current = fs;
        for (const segment of path) {
            if (current.children && current.children[segment]) {
                current = current.children[segment];
            } else {
                return null;
            }
        }
        return current;
    };

    const getCurrentNode = () => resolvePath(currentPath);

    const ls = () => {
        const node = getCurrentNode();
        if (node && node.children) {
            return Object.keys(node.children).map(name => {
                const child = node.children![name];
                return child.type === 'directory' ? `${name}/` : name;
            });
        }
        return [];
    };

    const cd = (path: string) => {
        if (path === '..') {
            if (currentPath.length > 0) {
                setCurrentPath(prev => prev.slice(0, -1));
                return '';
            }
            return '';
        }

        if (path === '/') {
            setCurrentPath([]);
            return '';
        }

        if (path === '~') {
            setCurrentPath(['home', 'guest']);
            return '';
        }

        const node = getCurrentNode();
        if (node && node.children && node.children[path] && node.children[path].type === 'directory') {
            setCurrentPath(prev => [...prev, path]);
            return '';
        }
        return `cd: ${path}: No such file or directory`;
    };

    const cat = (fileName: string) => {
        const node = getCurrentNode();
        if (node && node.children && node.children[fileName]) {
            if (node.children[fileName].type === 'file') {
                return node.children[fileName].content || '';
            }
            return `cat: ${fileName}: Is a directory`;
        }
        return `cat: ${fileName}: No such file or directory`;
    };

    const mkdir = (dirName: string) => {
        const node = getCurrentNode();
        if (node && node.children) {
            if (node.children[dirName]) {
                return `mkdir: cannot create directory '${dirName}': File exists`;
            }

            // Deep copy to avoid mutation issues
            const newFs = JSON.parse(JSON.stringify(fs));
            let current = newFs;
            for (const segment of currentPath) {
                current = current.children[segment];
            }

            current.children[dirName] = {
                type: 'directory',
                children: {}
            };

            setFs(newFs);
            return '';
        }
        return 'Error creating directory';
    };

    const touch = (fileName: string) => {
        const node = getCurrentNode();
        if (node && node.children) {
            if (node.children[fileName]) {
                // Update timestamp logic could go here, but for now just do nothing if exists
                return '';
            }

            const newFs = JSON.parse(JSON.stringify(fs));
            let current = newFs;
            for (const segment of currentPath) {
                current = current.children[segment];
            }

            current.children[fileName] = {
                type: 'file',
                content: ''
            };

            setFs(newFs);
            return '';
        }
        return 'Error creating file';
    };

    return {
        currentPath,
        ls,
        cd,
        cat,
        mkdir,
        touch
    };
};
