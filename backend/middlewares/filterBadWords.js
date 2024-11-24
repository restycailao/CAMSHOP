import Filter from 'bad-words';

const filter = new Filter();

// Add any additional custom words to filter if needed
filter.addWords('customword1', 'customword2');

const filterBadWords = async (req, res, next) => {
    try {
        if (req.body && req.body.comment) {
            const originalComment = req.body.comment;
            const cleanComment = filter.clean(originalComment);
            
            // Set the cleaned comment
            req.body.comment = cleanComment;
            
            // Set a flag if the comment was modified
            req.body.wasFiltered = cleanComment !== originalComment;
        }
        next();
    } catch (error) {
        console.error('Error in bad words filter:', error);
        // Continue without filtering if there's an error
        next();
    }
};

export default filterBadWords;
