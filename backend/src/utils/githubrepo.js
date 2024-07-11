import axios from 'axios';


const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_TOKEN = ''; // Replace with your GitHub token


const searchRepositories = async (repoName) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE_URL}/search/repositories`, {
      params: {
        q: repoName,
        sort: 'stars',
        order: 'desc',
      },
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error('Error searching repositories:', error);
    throw error;
  }
};

const fetchRepoContents = async (repoFullName, path = '') => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE_URL}/repos/${repoFullName}/contents/${path}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching contents for ${repoFullName} at path "${path}":`, error.message);
    throw error;
  }
};

const compareRepoCode = async (repoFullName, targetCode, path = '') => {
  try {
    const repoFiles = await fetchRepoContents(repoFullName, path);

    for (const file of repoFiles) {
      if (file.type === 'file' && file.name.endsWith('.js')) {
        const fileResponse = await axios.get(file.download_url);
        const fileContent = fileResponse.data;

        const similarity = compareCodeSimilarity(fileContent, targetCode);
        console.log(`File ${file.path} in ${repoFullName} similarity: ${similarity}%`);
      } else if (file.type === 'dir') {
        await compareRepoCode(repoFullName, targetCode, file.path);
      }
    }
  } catch (error) {
    console.error(`Error comparing code for ${repoFullName}:`, error.message);
  }
};

const compareCodeSimilarity = (code1, code2) => {
  const minLength = Math.min(code1.length, code2.length);
  let commonChars = 0;

  for (let i = 0; i < minLength; i++) {
    if (code1[i] === code2[i]) {
      commonChars++;
    }
  }

  const similarityPercentage = (commonChars / minLength) * 100;
  return similarityPercentage.toFixed(2);
};

const main = async () => {
  try {
    const repoName = 'Employees-react-app'; // Replace with the repo name you want to search
    const targetCode = `import { Component } from 'react';
import './employees-add-form.css';

class EmployeesAddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            salary: ''
        };
    }

    onValueChange = (e) => {
        this.setState(state => ({
            [e.target.name]: e.target.value
        }));
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.onAdd(this.state.name, this.state.salary);
        this.setState({
            name: '',
            salary: ''
        });
    }

    render() {
        const { name, salary } = this.state;

        return (
            <div className="app-add-form">
                <h3>Добавьте нового сотрудника</h3>
                <form className="add-form d-flex"
                    onSubmit={this.onSubmit}>
                    <input type="text"
                        className="form-control new-post-label"
                        placeholder="Как его зовут?"
                        name="name"
                        value={name}
                        onChange={this.onValueChange} />
                    <input type="number"
                        className="form-control new-post-label"
                        placeholder="З/П в $?"
                        name="salary"
                        value={salary}
                        onChange={this.onValueChange} />
                    <button type="submit" className="btn btn-outline-light">Добавить</button>
                </form>
            </div>
        )
    }
}

export default EmployeesAddForm`; // Replace with your target code for comparison

    const repos = await searchRepositories(repoName);

    if (repos.length === 0) {
      console.log('No repositories found with the name:', repoName);
      return;
    }

    console.log(`Found ${repos.length} repositories with the name ${repoName}:`);
    repos.forEach(repo => {
      console.log(`- ${repo.full_name}: ${repo.html_url}`);
    });

    for (const repo of repos) {
      if (repo.owner.login !== 'DWDW2') { // Exclude your own repositories
        console.log(`\nComparing code for repository: ${repo.full_name}`);
        await compareRepoCode(repo.full_name, targetCode);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

main();