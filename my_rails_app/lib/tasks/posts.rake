namespace :posts do
  desc 'TODO'
  task generate: :environment do
    Author.destroy_all
    5.times do
      author = Author.create!(
        name: Faker::Name.name
      )
      2.times do
        post = Post.create!(
          author: author,
          title: Faker::Movie.title,
          content: Faker::Lorem.paragraphs(number: 3).join("\n")
        )

        5.times do
          Comment.create!(
            post: post,
            content: Faker::Lorem.paragraph
          )
        end
      end
    end
  end
end
