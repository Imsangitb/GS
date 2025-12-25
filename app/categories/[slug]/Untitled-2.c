#include <stdio.h>
#include <stdlib.h>

int main() {
    // Declare the array of character pointers
    char *institute[] = {
        "National Institute of Technology",
        "Indian Institute of Technology",
        "Assam University"
    };

    // Calculate the number of elements in the array
    int numElements = sizeof(institute) / sizeof(institute[0]);

    // Calculate the size of each pointer (char *)
    int pointerSize = sizeof(char *);

    // Calculate the total memory allocated for the pointers in the array
    int totalMemory = numElements * pointerSize;

    // Print the results
    printf("Number of elements in the array: %d\n", numElements);
    printf("Size of each pointer (char *): %d bytes\n", pointerSize);
    printf("Total memory allocated for the 'institute' array: %d bytes\n", totalMemory);

    // Optionally, print the size of the strings themselves
    printf("\nSize of the strings:\n");
    for (int i = 0; i < numElements; i++) {
        printf("String %d: \"%s\" - Length: %ld bytes\n", i + 1, institute[i], strlen(institute[i]) + 1); // +1 for null terminator
    }
    return 0;
}

