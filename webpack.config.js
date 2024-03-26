module.exports = {
    // other webpack configuration options...
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer/"),
            "util": require.resolve("util/"),
            "process": require.resolve("process/browser"),
        },
    },
};