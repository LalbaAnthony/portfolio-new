const username = 'LalbaAnthony';

function getColorFromLanguage(language) {
    const data = {
        'JavaScript': '#f1e05a',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'PHP': '#4F5D95',
        'C#': '#178600',
        'C++': '#f34b7d',
        'Vue': '#2c3e50',
        'Python': '#3572A5',
        'TypeScript': '#2b7489',
        'Java': '#b07219',
        'C': '#555555'
    };
    return data[language] || data[language.toLowerCase()] || '#000000';
}

function formatRelativeDate(dateString) {
    const dateObject = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate - dateObject;
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const weeksDifference = Math.floor(daysDifference / 7);
    const majSentence = 'Mise à jour '
    let timeSentence = ''
    if (weeksDifference >= 2) {
        timeSentence = `il y a ${weeksDifference} semaines`;
    } else if (weeksDifference === 1) {
        timeSentence = 'il y a une semaine';
    } else if (daysDifference >= 2) {
        timeSentence = `il y a ${daysDifference} jours`;
    } else if (daysDifference === 1) {
        timeSentence = 'hier';
    } else if (hoursDifference >= 2) {
        timeSentence = `il y a ${hoursDifference} heures`;
    } else if (hoursDifference === 1) {
        timeSentence = 'il y a une heure';
    } else if (minutesDifference >= 2) {
        timeSentence = `il y a ${minutesDifference} minutes`;
    } else if (minutesDifference === 1) {
        timeSentence = 'il y a une minute';
    } else {
        timeSentence = 'à l\'instant';
    }
    return majSentence + timeSentence;
}

async function getProjects(orderby = 'date', order = 'desc') {
    try {
        // Fetch projects
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }
        const projects = await response.json();

        // Format projects
        const formattedProjects = projects.map(project => ({
            name: project.name,
            url: project.html_url,
            language: project.language,
            language_color: getColorFromLanguage(project.language),
            updated_at: project.updated_at,
            updated_at_relative: formatRelativeDate(project.updated_at),
        }));

        // Sort projects
        formattedProjects.sort((a, b) => {
            if (orderby === 'updated') {
                if (order === 'asc') {
                    return new Date(b.updated_at) - new Date(a.updated_at);
                } else if (order === 'desc') {
                    return new Date(a.updated_at) - new Date(b.updated_at);
                } else {
                    return 0;
                }
            } else if (orderby === 'name') {
                if (order === 'asc') {
                    return a.name.localeCompare(b.name);
                } else if (order === 'desc') {
                    return b.name.localeCompare(a.name);
                }
                else {
                    return 0;
                }
            } else {
                return 0;
            }
        });

        return formattedProjects;

    } catch (error) {
        console.error('Erreur :', error.message);
        return [];
    }
}