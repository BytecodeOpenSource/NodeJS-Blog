const listAuthors = async knex => {
    const authors = await knex.select('*').from('authors');
    return authors;
};

const getAuthor = async (knex, id) => {
    const author = await knex
        .select('*')
        .from('authors')
        .where({ id });
    return author[0];
};

const addAuthor = async (knex, author) => {
    const newAuthorData = {
        name: author.name,
        image_url: author.image_url,
        role: author.role,
    };
    const returning = ['id', 'name', 'image_url', 'role'];
    const newAuthor = await knex('authors')
        .insert([newAuthorData])
        .returning(returning);
    return newAuthor[0];
};

const modifyAuthor = async (knex, id, author) => {
    // eslint-disable-next-line camelcase
    const { name, image_url, role } = author;
    const newAuthorData = { name, image_url, role };
    const oldAuthorData = getAuthor(knex, id);
    const newAuthor = Object.assign({}, { ...oldAuthorData, ...newAuthorData });
    const returning = ['id', 'name', 'image_url', 'role'];
    const modifiedAuthor = await knex('authors')
        .returning(returning)
        .where('id', '=', id)
        .update(newAuthor);
    return modifiedAuthor[0];
};

const deleteAuthor = async (knex, id) =>
    new Promise(resolve => {
        knex('users')
            .where({ author_id: id })
            .update({ author_id: null }) // foreign key
            .then(() =>
                knex('authors')
                    .returning(['id'])
                    .where({ id })
                    .delete()
                    .then(data => resolve(data[0])),
            ); // eslint-disable-line
    });

module.exports = {
    listAuthors,
    getAuthor,
    addAuthor,
    modifyAuthor,
    deleteAuthor,
};
