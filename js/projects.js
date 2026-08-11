// Projects Interactive Logic
function copyCommitHash(hash) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(hash);
        showToast(`Copied commit hash [${hash}] to clipboard!`);
        playClickSound(900, 0.03);
    } else {
        showToast(`Commit hash: ${hash}`);
    }
}

window.copyCommitHash = copyCommitHash;
