function generateRandomPassword(firstName, lastName, phone) {
    const allChars = firstName + lastName + phone; // Combine all characters

    let password = '';

    // Randomly pick 8 characters from the combined string
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }

    return password;
}

module.exports = {
    generateRandomPassword
}