module.exports = (theFunc) => (req, res, next) => {
    // The unresolved promise of async functions get resolved
    // and then it gets to next statement
    Promise.resolve(theFunc(req, res, next)).catch(next);
};
