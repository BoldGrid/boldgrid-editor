<?php get_header(); ?>

<main class="main bg-custom-template" role="main">
	<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php
		the_post();

		if ( Boldgrid_Editor_Service::get( 'page_title' )->has_title_displayed() && get_the_title() ) { ?>
			<header class="container entry-header">
				<h1 class="entry-title"><?php the_title(); ?></h1>
			</header>
		<?php } ?>

		<div class="entry-content">
			<?php the_content(); ?>
		</div>
		<div class="bg-edit-link">
			<a title="Edit Page" href="<?php print get_edit_post_link() ?>"><i class="fa fa-pencil"
				aria-hidden="true"></i></a>
		</div>
	</article>
</main>

<?php get_footer(); ?>
