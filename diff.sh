# diff -n tempF.txt mainF.txt > diff.txt
if [[ -s tempF.txt ]]; then comm -2 -3 <(sort mainF.txt) <(sort tempF.txt) >diff.txt; else cp mainF.txt tempF.txt; fi

# comm -2 -3 <(sort mainF.txt) <(sort tempF.txt) > diff.txt
